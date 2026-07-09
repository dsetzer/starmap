<script lang="ts">
	export let searchOpen = true;
	export let resultsOpen = true;
	export let onToggleSearch: () => void = () => {};
	export let onToggleResults: () => void = () => {};
</script>

<div class="navbar">
	<div class="navbar-inner">
		<button type="button" class="nav-btn" class:active={searchOpen} on:click={onToggleSearch}>
			Search
		</button>
		<button type="button" class="nav-btn" class:active={resultsOpen} on:click={onToggleResults}>
			Results
		</button>
	</div>
</div>

<style>
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 44px;
		background: linear-gradient(180deg, var(--t-surface-high, var(--green-1)), var(--t-surface, var(--surface)));
		border-bottom: 1px solid var(--t-border, var(--green-4));
		z-index: 500;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.navbar-inner {
		display: flex;
		gap: 0.5rem;
	}
	.nav-btn {
		font-family: var(--t-font-mono, ui-monospace, monospace);
		font-size: 0.72rem;
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		padding: 0.4rem 1rem;
		border: 1px solid var(--t-border, var(--green-3));
		border-radius: var(--t-radius-sm, 0.3rem);
		background: transparent;
		color: var(--t-text-dim, var(--text));
		cursor: pointer;
		transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
	}
	.nav-btn:hover {
		border-color: var(--t-primary, var(--green-4));
		color: var(--t-text, var(--text));
	}
	.nav-btn.active {
		background: var(--t-primary, var(--green-3));
		border-color: var(--t-primary, var(--green-4));
		color: var(--t-on-primary, var(--text));
	}
</style>
