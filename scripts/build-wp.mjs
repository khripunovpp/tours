/**
 * Build the WordPress plugin's JS assets from the shared packages into
 * packages/wordpress-adapter/assets. Two self-contained, minified bundles with
 * unique globals so they never collide with other plugins/themes:
 *
 *   tours-front.js  (window.SiteToursFront) — player + draft→tour compile
 *   tours-admin.js  (window.SiteToursAdmin) — the builder + WordPress store
 */
import { build } from 'vite';
import { readFileSync, readdirSync, cpSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';

const OUT = 'packages/wordpress-adapter/assets';
const PLUGIN = 'packages/wordpress-adapter';
const DIST = 'dist/wordpress-plugin';
const SLUG = 'site-tours';

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

// Assemble the installable plugin into dist/wordpress-plugin/site-tours (a
// slug-named folder, as WordPress expects), then zip it for upload.
rmSync(DIST, { recursive: true, force: true });
for (const item of ['site-tours.php', 'uninstall.php', 'readme.txt', 'includes', 'assets']) {
  cpSync(`${PLUGIN}/${item}`, `${DIST}/${SLUG}/${item}`, { recursive: true });
}
let zipped = false;
try {
  execSync(`zip -qr ${SLUG}.zip ${SLUG}`, { cwd: DIST });
  zipped = true;
} catch (err) {
  console.warn('  (zip not created — is the `zip` command available?)', err.message);
}

console.log('✓ WordPress assets written to', OUT);
console.log(`✓ plugin folder: ${DIST}/${SLUG}` + (zipped ? `\n✓ upload zip:    ${DIST}/${SLUG}.zip` : ''), '\n');
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
for (const file of readdirSync(OUT).filter((f) => f.endsWith('.js')).sort()) {
  const raw = readFileSync(`${OUT}/${file}`);
  console.log(`  ${file.padEnd(18)} ${kb(raw.length).padStart(9)} raw  ${kb(gzipSync(raw).length).padStart(9)} gzip`);
}
