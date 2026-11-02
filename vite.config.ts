import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			// Inline the CSS into the HTML so the first paint needs no extra request.
			inlineStyleThreshold: 40000
		})
	],
	server: {
		port: 5500,
		strictPort: false
	},
	preview: {
		port: 5500,
		strictPort: false
	}
});
