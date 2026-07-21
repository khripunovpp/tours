/**
 * Build committed, static library bundles into /dist.
 *
 * Each entry is built on its own (single-entry lib mode) so every output file
 * is fully self-contained — no shared chunks — and can be dropped onto a page
 * as-is. Uses Vite's build API so the repo's `.js`→`.ts` import resolution
 * works exactly like it does for the demo.
 *
 *   dist/tours-editor.js      ESM  — the tour builder (bundles core + schema)
 *   dist/tours-editor.umd.js  UMD  — same, as window.Tours for classic <script>
 *   dist/tours-player.js      ESM  — the visitor-facing player + picker
 */
import { build } from 'vite';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

/** One self-contained lib build. */
function lib({ entry, fileName, format, name, empty }) {
  return build({
    configFile: false,
    logLevel: 'warn',
    build: {
      outDir: 'dist',
      emptyOutDir: empty,
      // No sourcemaps in the committed drop-in bundles — keeps dist and the
      // repo lean. Regenerate locally with sourcemaps if you need to debug.
      sourcemap: false,
      minify: 'esbuild',
      target: 'es2020',
      lib: {
        entry,
        formats: [format],
        name,
        fileName: () => fileName,
      },
    },
  });
}

// First build empties dist; the rest append to it.
await lib({
  entry: 'packages/editor/src/index.ts',
  fileName: 'tours-editor.js',
  format: 'es',
  empty: true,
});
await lib({
  entry: 'packages/editor/src/index.ts',
  fileName: 'tours-editor.umd.js',
  format: 'umd',
  name: 'Tours',
  empty: false,
});
await lib({
  entry: 'packages/core/src/index.ts',
  fileName: 'tours-player.js',
  format: 'es',
  empty: false,
});

// emptyOutDir wiped dist, so (re)write the usage README alongside the bundles.
writeFileSync('dist/README.md', readme());

// Report raw + gzip sizes so bundle weight stays visible.
console.log('✓ library bundles written to /dist\n');
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
for (const file of readdirSync('dist').filter((f) => f.endsWith('.js')).sort()) {
  const raw = readFileSync(`dist/${file}`);
  console.log(`  ${file.padEnd(22)} ${kb(raw.length).padStart(9)} raw  ${kb(gzipSync(raw).length).padStart(9)} gzip`);
}

function readme() {
  return `# dist — built artifacts

Run \`pnpm build:all\` to produce everything here:

| Path | What |
|---|---|
| \`tours-editor.js\` / \`.umd.js\` | Library — tour builder (ESM / \`window.Tours\`) |
| \`tours-player.js\` | Library — visitor-facing player + picker (ESM) |
| \`wordpress-plugin/site-tours/\` | Installable WordPress plugin (folder) |
| \`wordpress-plugin/site-tours.zip\` | Same plugin, zipped for WP upload |
| \`extension/\` | MV3 browser extension — load unpacked |

The library bundles are committed; \`wordpress-plugin/\` and \`extension/\` are
derived (sources in \`packages/*\`) and git-ignored — build them locally.

## WordPress plugin

Upload \`wordpress-plugin/site-tours.zip\` via **Plugins → Add New → Upload**,
or copy \`wordpress-plugin/site-tours/\` into \`wp-content/plugins/\`.

## Library bundles

Static, self-contained (no shared chunks), minified. Approx. gzip:
\`tours-player.js\` ~6 KB, \`tours-editor.js\` ~20 KB.

## Use the builder

ES module:

\`\`\`html
<script type="module">
  import { TourBuilder } from './dist/tours-editor.js';
  new TourBuilder({ mode: 'edit' }).mount();
</script>
\`\`\`

Classic script (UMD global):

\`\`\`html
<script src="./dist/tours-editor.umd.js"></script>
<script>
  new Tours.TourBuilder({ mode: 'edit' }).mount();
</script>
\`\`\`

No-code activation — include the script and open the page with the flag:

\`\`\`html
<script type="module">
  import { TourBuilder } from './dist/tours-editor.js';
  TourBuilder.fromUrl(); // mounts when the URL has ?tours-edit=1
</script>
\`\`\`

## Use the player

\`\`\`html
<script type="module">
  import { createPlayer } from './dist/tours-player.js';
  createPlayer(tour).start(); // \`tour\` is a @tours/schema Tour object
</script>
\`\`\`
`;
}
