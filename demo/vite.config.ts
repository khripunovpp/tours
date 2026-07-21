import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// The mock "Community" site + triggers showcase + vanilla SPA. Framework SPA
// demos live in their own packages under demos/* (each with its own toolchain).
export default defineConfig({
  server: { open: '/hub.html' },
  build: {
    rollupOptions: {
      input: {
        hub: resolve(import.meta.dirname, 'hub.html'),
        main: resolve(import.meta.dirname, 'index.html'),
        profile: resolve(import.meta.dirname, 'profile.html'),
        triggers: resolve(import.meta.dirname, 'triggers.html'),
        spa: resolve(import.meta.dirname, 'spa.html'),
      },
    },
  },
});
