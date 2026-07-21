/**
 * Build the MV3 extension into dist/: a bundled content script (IIFE — content
 * scripts aren't modules) and a service-worker background (ESM), plus the
 * manifest. Uses Vite's build API so the workspace's `.js`→`.ts` imports
 * resolve like everywhere else.
 */
import { build } from 'vite';
import { copyFileSync, mkdirSync } from 'node:fs';

// Output into the repo-root dist so every distributable lives under dist/.
const OUT = '../../dist/extension';

function bundle({ entry, name, fileName, format, empty }) {
  return build({
    configFile: false,
    logLevel: 'warn',
    build: {
      outDir: OUT,
      emptyOutDir: empty,
      sourcemap: false,
      minify: 'esbuild',
      target: 'es2020',
      lib: { entry, name, formats: [format], fileName: () => fileName },
    },
  });
}

await bundle({ entry: 'src/content.ts', name: 'ToursAuthoring', fileName: 'content.js', format: 'iife', empty: true });
await bundle({ entry: 'src/background.ts', name: 'ToursBg', fileName: 'background.js', format: 'es', empty: false });
mkdirSync(OUT, { recursive: true });
copyFileSync('manifest.json', `${OUT}/manifest.json`);

console.log('✓ extension built to dist/extension (load it unpacked)');
