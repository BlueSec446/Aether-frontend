import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		environment: 'jsdom',
		globals: true,
	},
	server: {
		host: true,
		port: 5173,

		watch: {
			usePolling: true,
			interval: 100
		},
		
		hmr: {
			host: 'localhost',
			protocol: 'ws',
		}
	}
});
