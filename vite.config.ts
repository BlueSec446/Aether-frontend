import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    conditions: ['mode', 'browser'] // only handle as browser not as server
  },
  test: {
    environment: 'jsdom',
    globals: true
  },
  server: {
    host: true,
    port: process.env.FRONTEND_PORT ? parseInt(process.env.FRONTEND_PORT) : 5173,
    strictPort: true,

    watch: {
      usePolling: true,
      interval: 100
    },

    hmr: {
      host: 'localhost',
      protocol: 'ws',
      clientPort: process.env.FRONTEND_PORT ? parseInt(process.env.FRONTEND_PORT) : 5173
    }
  }
});
