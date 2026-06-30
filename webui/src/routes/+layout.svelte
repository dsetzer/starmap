<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { registerServiceWorker } from '../pwa';

	onMount(() => {
		registerServiceWorker();
	});
</script>

<slot />
