<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	onMount(async () => {
		// the service worker is only generated for production builds, so
		// registering it in dev just 404s
		if (!dev && 'serviceWorker' in navigator) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({ immediate: true });
		}
	});
</script>

<slot />
