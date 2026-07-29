import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { toursAliases } from '../../scripts/dev-aliases.mjs';

export default defineConfig({
  resolve: { alias: toursAliases },
  plugins: [solid()],
  server: { port: 5404 },
});
