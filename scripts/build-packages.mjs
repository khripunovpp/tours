/**
 * Build the three installable packages into `packages/<name>/dist`.
 *
 * Each package installs under any package manager, any bundler, and straight
 * from a CDN:
 *
 *   dist/index.js      ESM  — modern bundlers, Node ESM, Deno, Bun
 *   dist/index.umd.js  UMD  — classic <script>, unpkg/jsDelivr, no build step
 *   dist/index.d.ts    types
 *
 * **ESM-only, deliberately.** There is no CJS build, so `require('@tours/core')`
 * throws ERR_REQUIRE_ESM. These packages are browser-only — they need `document`
 * and `attachShadow`, so they cannot run in bare Node regardless, and every
 * current bundler prefers the ESM entry anyway. Carrying a CJS copy cost ~50%
 * on the tarball (core 107 KB → 71 KB without it) to serve only jsdom tests and
 * pre-`exports` tooling. Anything that needs a plain script-tag global should
 * load the UMD bundle instead.
 *
 * are-the-types-wrong therefore reports `node16 (from CJS)` as "ESM (dynamic
 * import only)". That is the intended state, not a regression.
 *
 * Outputs are fully self-contained: cross-package imports are aliased to source
 * and bundled in, so a published package declares **no runtime dependencies**.
 * That is deliberate — these are also installed straight from git, and a
 * git-installed package sits outside the workspace, where a `workspace:*`
 * dependency cannot resolve.
 *
 * The cost is duplication: a project installing both core and editor gets two
 * copies of the schema (~2 KB gzip). That matches how the drop-in bundles in
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

/**
 * UMD needs a global name. Keep them distinct so a page can load more than one
 * <script> without the second clobbering the first.
 */
const PACKAGES = [
  { name: 'schema', global: 'ToursSchema' },
  { name: 'core', global: 'ToursCore' },
  { name: 'editor', global: 'ToursEditor' },
];

/** One single-entry lib build, so no output depends on a shared chunk. */
function lib({ dir, formats, fileName, global, minify, empty }) {
  return build({
    configFile: false,
    logLevel: 'warn',
    resolve: { alias },
    build: {
      outDir: `${dir}/dist`,
      emptyOutDir: empty,
      sourcemap: true,
      minify,
      // es2020 keeps optional chaining and nullish coalescing native while
      // still parsing in every browser and Node the package claims to support.
      target: 'es2020',
      lib: { entry: `${dir}/src/index.ts`, formats, fileName, name: global },
    },
  });
}

for (const { name, global } of PACKAGES) {
  const dir = `packages/${name}`;

  // ESM: unminified, because consumers minify it themselves and want readable
  // stack traces until they do.
  await lib({
    dir,
    formats: ['es'],
    fileName: () => 'index.js',
    minify: false,
    empty: true,
  });

  // UMD is loaded directly off a CDN, so it *is* the final artifact — minify it.
  await lib({
    dir,
    formats: ['umd'],
    fileName: () => 'index.umd.js',
    global,
    minify: 'esbuild',
    empty: false,
  });

  // Roll every .d.ts up into one file, inlining the cross-package types.
  //
  // `--export-referenced-types false` keeps internal helper types out of the
  // public surface, but it also means a type is only exported if the entry
  // point exports it *by name*. A type merely mentioned in a signature gets
  // inlined as a non-exported declaration, and consumers then cannot name it —
  // `Tour` was invisible this way despite `createPlayer(tour: Tour)`.
  //
  // So anything that appears in a public signature must be re-exported
  // explicitly from packages/<name>/src/index.ts.
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
for (const { name } of PACKAGES) {
  const dir = `packages/${name}/dist`;
  for (const file of readdirSync(dir).filter((f) => !f.endsWith('.map')).sort()) {
    const raw = readFileSync(`${dir}/${file}`);
    const label = `@tours/${name}  ${file}`;
    console.log(`  ${label.padEnd(32)} ${kb(raw.length).padStart(9)} raw  ${kb(gzipSync(raw).length).padStart(9)} gzip`);
  }
}
