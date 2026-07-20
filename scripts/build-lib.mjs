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

/** One self-contained lib build. */
function lib({ entry, fileName, format, name, empty }) {
  return build({
    configFile: false,
    logLevel: 'warn',
    build: {
      outDir: 'dist',
      emptyOutDir: empty,
      sourcemap: true,
      minify: 'esbuild',
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

console.log('✓ library bundles written to /dist');
