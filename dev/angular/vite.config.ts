import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { toursAliases } from '../../scripts/dev-aliases.mjs';

// Aliased to package source so editing the library hot-reloads here.
export default defineConfig({
  resolve: { alias: toursAliases },
  plugins: [angular({ tsconfig: 'tsconfig.app.json' })],
  server: { port: 5301, open: true },
});
