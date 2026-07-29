import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { toursAliases } from '../../scripts/dev-aliases.mjs';

export default defineConfig({
  resolve: { alias: toursAliases },
  plugins: [vue()],
  server: { port: 5402 },
});
