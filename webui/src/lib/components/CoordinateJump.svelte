<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let entry = '';

	function jump() {
		const m = entry.match(/^\s*(-?\d+)\s*,?\s*(-?\d+)\s*,?\s*(-?\d+)?\s*,?\s*(-?\d+)?\s*$/);
		if (!m) return;
		const [, xs, ys, zs, ws] = m;
		dispatch('jump', {
			x: +xs,
			y: +ys,
			z: zs ? +zs : 0,
			w: ws ? +ws : 0
		});
	}
</script>

<div class="jump">
	<input bind:value={entry} placeholder="x,y,z,w" />
	<button on:click={jump}>Go</button>
</div>

<style>
	.jump {
		position: fixed;
		left: 16px;
		bottom: 16px;
		display: flex;
		gap: 8px;
		align-items: center;
		z-index: 1000;
		padding: 0.35rem 0.55rem;
		border-radius: 0.65rem;
		background: rgba(15, 23, 42, 0.88);
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
	}
	input {
		width: 110px;
		padding: 0.4rem 0.6rem;
		border-radius: 0.55rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.04);
		color: #f8fafc;
		font: 0.88rem system-ui, sans-serif;
		outline: none;
	}
	input::placeholder {
		color: rgba(248, 250, 252, 0.7);
	}
	button {
		padding: 0.4rem 0.75rem;
		border-radius: 0.55rem;
		border: none;
		background: rgba(56, 189, 248, 0.92);
		color: #0f172a;
		font: 0.88rem system-ui, sans-serif;
		cursor: pointer;
		transition: background 0.2s ease, transform 0.2s ease;
	}
	button:hover {
		background: rgba(56, 189, 248, 1);
		transform: translateY(-1px);
	}
	button:active {
		background: rgba(56, 189, 248, 0.8);
		transform: translateY(0);
	}
</style>
