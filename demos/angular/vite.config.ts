import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { toursAliases } from '../../scripts/dev-aliases.mjs';

export default defineConfig({
  resolve: { alias: toursAliases },
  // The plugin needs a tsconfig whose `noEmit` is false. Inheriting the repo's
  // base config (noEmit: true) made it silently emit nothing: the build produced
  // a 0.7 KB bundle containing only Vite's modulepreload polyfill, with no
  // Angular in it at all.
  plugins: [angular({ tsconfig: 'tsconfig.app.json' })],
  server: { port: 5405 },
});
