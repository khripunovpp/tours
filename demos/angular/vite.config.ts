import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { toursAliases } from '../../scripts/dev-aliases.mjs';

export default defineConfig({
  resolve: { alias: toursAliases },
  plugins: [angular()],
  server: { port: 5405 },
});
