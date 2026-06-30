<script lang="ts">
	export let value: number = 0; // 0 = any, 1 = include, -1 = exclude
	export let label: string;
	export let onChange: (newValue: number) => void = () => {};
	export let className: string = '';
</script>

<button
	type="button"
	class="tri-pill {className} {value === 1 ? 'on' : ''} {value === -1 ? 'off' : ''}"
	on:click={() => onChange(((value + 2) % 3) - 1)}
	aria-pressed={value !== 0}
>
	<span class="tri-pill-check">
		{#if value === 1}
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
			</svg>
		{:else if value === -1}
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
			</svg>
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
				<circle cx="12" cy="12" r="10" />
			</svg>
		{/if}
	</span>
	{label}
</button>

<style>
	.tri-pill {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		border: 1px solid var(--t-border);
		background: transparent;
		color: var(--t-text);
		border-radius: var(--t-radius-sm);
		padding: 0.28rem 0.45rem;
		flex: 0 0 auto;
		font-family: var(--t-font-mono);
		font-size: 0.78rem;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: border-color 0.15s ease, background 0.15s ease;
	}
	.tri-pill:hover {
		border-color: var(--t-primary);
	}
	.tri-pill.on {
		background: color-mix(in oklab, var(--t-primary) 18%, transparent);
		border-color: var(--t-primary);
		color: var(--t-primary-text);
	}
	.tri-pill.off {
		background: color-mix(in oklab, var(--t-error) 16%, transparent);
		border-color: var(--t-error);
		color: var(--t-error);
	}
	.tri-pill-check {
		width: 1rem;
		height: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.9;
	}
	.tri-pill-check svg {
		width: 0.85rem;
		height: 0.85rem;
		flex-shrink: 0;
	}
</style>
