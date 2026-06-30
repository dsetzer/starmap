import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sveltekit(),
		devtoolsJson(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.svg', 'robots.txt'],
			manifest: {
				name: 'Starmap',
				short_name: 'Starmap',
				start_url: '/',
				display: 'standalone',
				background_color: '#0f172a',
				theme_color: '#0f172a',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,avif,txt,json,wasm}']
			}
		})
	]
});
