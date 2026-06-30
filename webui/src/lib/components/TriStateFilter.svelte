<script lang="ts">
	export let value: number = 0; // 0 = any, 1 = yes/has, -1 = no
	export let onChange: (newValue: number) => void = () => {};
	export let yesLabel: string = 'Yes';
	export let noLabel: string = 'No';
	export let anyLabel: string = 'Any';
	export let className: string = '';
</script>

<div class="seg {className}">
	<button
		type="button"
		class:selected={value === 0}
		on:click={() => onChange(0)}
	>{anyLabel}</button>
	<button
		type="button"
		class:selected={value === 1}
		on:click={() => onChange(1)}
	>{yesLabel}</button>
	<button
		type="button"
		class:selected={value === -1}
		on:click={() => onChange(-1)}
	>{noLabel}</button>
</div>

<style>
	.seg {
		display: inline-grid;
		grid-auto-flow: column;
	}
	.seg button {
		border: 1px solid var(--t-border);
		background: transparent;
		color: var(--t-text-dim);
		padding: 0.32rem 0.6rem;
		line-height: 1;
		font-family: var(--t-font-mono);
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		cursor: pointer;
		transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
	}
	.seg.sm button {
		padding: 0.32rem 0.5rem;
	}
	.seg.xs button {
		padding: 0.26rem 0.4rem;
		font-size: 0.66rem;
	}
	.seg button:first-child {
		border-radius: var(--t-radius-sm) 0 0 var(--t-radius-sm);
	}
	.seg button:last-child {
		border-radius: 0 var(--t-radius-sm) var(--t-radius-sm) 0;
	}
	.seg button:not(:first-child) {
		border-left: none;
	}
	.seg button:hover {
		border-color: var(--t-primary);
		color: var(--t-text);
	}
	.seg button.selected {
		background: var(--t-primary);
		border-color: var(--t-primary);
		color: var(--t-primary-text);
	}
</style>
