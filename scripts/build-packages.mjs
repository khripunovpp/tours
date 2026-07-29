/**
 * Build the three installable npm packages into `packages/<name>/dist`.
 *
 *   packages/schema/dist/index.{js,d.ts}
 *   packages/core/dist/index.{js,d.ts}
 *   packages/editor/dist/index.{js,d.ts}
 *
 * Each output is fully self-contained: cross-package imports are aliased to
 * source and bundled in, so a published package declares **no runtime
 * dependencies**. That is deliberate — these are installed straight from git
 * (`pnpm add "git+ssh://…#path:/packages/core"`), and a git-installed package
 * sits outside the workspace, where a `workspace:*` dependency cannot resolve.
 *
 * The cost is duplication: a project installing both core and editor gets two
 * copies of the schema (~3 KB gzip). That matches how the drop-in bundles in
 * the repo-root `dist/` already work — see scripts/build-lib.mjs.
 *
 * Unlike the root `dist/`, these outputs are **committed**, because git install
 * ships the tree as-is — there is no publish step to build them.
 */
import { build } from 'vite';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

/** Cross-package imports resolve to source, never to a sibling's dist. */
const alias = {
  '@tours/core': resolve('packages/core/src/index.ts'),
  '@tours/editor': resolve('packages/editor/src/index.ts'),
  '@tours/schema': resolve('packages/schema/src/index.ts'),
};

/** Build order is irrelevant (everything comes from source), but reads well. */
const PACKAGES = ['schema', 'core', 'editor'];

for (const name of PACKAGES) {
  const dir = `packages/${name}`;

  await build({
    configFile: false,
    logLevel: 'warn',
    resolve: { alias },
    build: {
      outDir: `${dir}/dist`,
      emptyOutDir: true,
      // Consumers bundle these themselves and want readable stack traces, so
      // unlike the drop-in bundles in the root dist/ these ship a sourcemap.
      sourcemap: true,
      minify: false,
      target: 'es2020',
      lib: {
        entry: `${dir}/src/index.ts`,
        formats: ['es'],
        fileName: () => 'index.js',
      },
    },
  });

  // Roll every .d.ts up into one file, inlining the cross-package types.
  execFileSync(
    'pnpm',
    [
      'exec',
      'dts-bundle-generator',
      '--project', 'scripts/tsconfig.dts.json',
      '--no-banner',
      '--export-referenced-types', 'false',
      '-o', `${dir}/dist/index.d.ts`,
      `${dir}/src/index.ts`,
    ],
    { stdio: ['ignore', 'ignore', 'inherit'] },
  );
}

console.log('✓ npm packages built to packages/*/dist\n');
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
for (const name of PACKAGES) {
  const dir = `packages/${name}/dist`;
  for (const file of readdirSync(dir).filter((f) => !f.endsWith('.map')).sort()) {
    const raw = readFileSync(`${dir}/${file}`);
    const label = `@tours/${name}  ${file}`;
    console.log(`  ${label.padEnd(30)} ${kb(raw.length).padStart(9)} raw  ${kb(gzipSync(raw).length).padStart(9)} gzip`);
  }
}
