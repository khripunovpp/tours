/**
 * Build the WordPress plugin's JS assets from the shared packages into
 * packages/wordpress-adapter/assets. Two self-contained, minified bundles with
 * unique globals so they never collide with other plugins/themes:
 *
 *   tours-front.js  (window.SiteToursFront) — player + draft→tour compile
 *   tours-admin.js  (window.SiteToursAdmin) — the builder + WordPress store
 */
import { build } from 'vite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const OUT = 'packages/wordpress-adapter/assets';

// front.ts lives in a package with no node_modules of its own, so map the
// workspace imports straight to source.
const alias = {
  '@tours/core': resolve('packages/core/src/index.ts'),
  '@tours/editor': resolve('packages/editor/src/index.ts'),
  '@tours/schema': resolve('packages/schema/src/index.ts'),
};

function bundle({ entry, fileName, name, empty }) {
  return build({
    configFile: false,
    logLevel: 'warn',
    resolve: { alias },
    build: {
      outDir: OUT,
      emptyOutDir: empty,
      sourcemap: false,
      minify: 'esbuild',
      target: 'es2020',
      lib: { entry, formats: ['umd'], name, fileName: () => fileName },
    },
  });
}

await bundle({
  entry: 'packages/wordpress-adapter/src/front.ts',
  fileName: 'tours-front.js',
  name: 'SiteToursFront',
  empty: true,
});
await bundle({
  entry: 'packages/editor/src/index.ts',
  fileName: 'tours-admin.js',
  name: 'SiteToursAdmin',
  empty: false,
});

console.log('✓ WordPress assets written to', OUT, '\n');
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
for (const file of readdirSync(OUT).filter((f) => f.endsWith('.js')).sort()) {
  const raw = readFileSync(`${OUT}/${file}`);
  console.log(`  ${file.padEnd(18)} ${kb(raw.length).padStart(9)} raw  ${kb(gzipSync(raw).length).padStart(9)} gzip`);
}
