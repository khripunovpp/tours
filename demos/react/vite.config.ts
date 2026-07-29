import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { toursAliases } from '../../scripts/dev-aliases.mjs';

export default defineConfig({
  resolve: { alias: toursAliases },
  plugins: [react()],
  server: { port: 5401 },
});
