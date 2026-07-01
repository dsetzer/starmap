<script lang="ts">
	import { searchUniverse } from '$lib/util/universeSearch';
	import Window from './Window.svelte';
	import TriStateFilter from './TriStateFilter.svelte';
	import TriPill from './TriPill.svelte';
	import RangeSlider from 'svelte-range-slider-pips';
	import 'svelte-range-slider-pips/dist/svelte-range-slider-pips.css';
	import {
		Resource,
		SearchType,
		PlanetType,
		StarType,
		type SearchResult,
		type UniverseData
	} from '$lib/util/types';
	import { onMount, onDestroy } from 'svelte';

	export let left = 200;
	export let top = 200;
	export let search_results: SearchResult | null = null;
	export let universe_data: UniverseData;

	const types = ['Starts with', 'Contains', 'Ends with'];

	const allResources = [
		Resource.Iron,
		Resource.Copper,
		Resource.Coal,
		Resource.Lead,
		Resource.Titanium,
		Resource.Uranium,
		Resource.Jade,
		Resource.Gold,
		Resource.Diamond,
		Resource.Beryllium,
		Resource.Aluminum
	];

	let name_box = '';
	let name_selected_type = SearchType.StartsWith;
	let ranmat_box = '';
	let ranmat_selected_type = SearchType.StartsWith;
	let coord_box = '';

	let planet_type_filters: Record<number, number> = {};
	for (const key in PlanetType) if (!isNaN(Number(key))) planet_type_filters[Number(key)] = 0;

	let star_type_filters: Record<number, number> = {};
	for (const key in StarType) if (!isNaN(Number(key))) star_type_filters[Number(key)] = 0;

	let ring_filter: number = 0; // 0 = any, 1 = has, -1 = no
	let atmosphere_filter: number = 0; // 0 = any, 1 = yes, -1 = no
	let tidal_filter: number = 0; // 0 = any, 1 = yes, -1 = no
	let earthlikes_filter: number = 0; // 0 = any, 1 = yes, -1 = no

	let temperature_range: [number, number] = [-400, 400];
	let gravity_range: [number, number] = [0, 400];

	let resource_tri: Record<number, number> = {};
	for (const r of allResources) resource_tri[r] = 0;

	let color_hex = '';
	let color_similarity = 0;
	let secondary_color_hex = '';
	let secondary_color_similarity = 0;
	let colorPickerReady = false;
	let color_input = '';
	let secondary_color_input = '';
	let hexPickerEl: any;
	let hexPickerSecondaryEl: any;
	let sizeClass = '';
	let collapsed = false;
	let primaryPickerOpen = false;
	let secondaryPickerOpen = false;
	let formEl: HTMLDivElement;
	let ro: ResizeObserver | null = null;
	let spMaxHeight: number | undefined;
	const spMinWidth = 360;
	const spDefaultWidth = 720;
	const spMaxWidth = 960;
	function normalizeColor(v: string): string | '' {
		if (!v) return '';
		v = v.trim();
		const hexMatch = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
		if (hexMatch.test(v)) {
			let h = v.replace('#', '').toLowerCase();
			if (h.length === 3)
				h = h
					.split('')
					.map((c) => c + c)
					.join('');
			return '#' + h;
		}
		const rgbMatch = /^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
		const m = v.match(rgbMatch);
		if (m) {
			const r = Math.min(255, parseInt(m[1]));
			const g = Math.min(255, parseInt(m[2]));
			const b = Math.min(255, parseInt(m[3]));
			const toHex = (n: number) => n.toString(16).padStart(2, '0');
			return '#' + toHex(r) + toHex(g) + toHex(b);
		}
		return '';
	}
	function color_text_oninput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		color_input = e.currentTarget.value;
		const n = normalizeColor(color_input);
		if (n) {
			color_hex = n;
			if (hexPickerEl) hexPickerEl.color = n;
			run();
		}
	}

	function secondary_color_text_oninput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		secondary_color_input = e.currentTarget.value;
		const n = normalizeColor(secondary_color_input);
		if (n) {
			secondary_color_hex = n;
			if (hexPickerSecondaryEl) hexPickerSecondaryEl.color = n;
			run();
		}
	}
	onMount(async () => {
		if (typeof window !== 'undefined') {
			await import('vanilla-colorful/hex-color-picker.js');
			colorPickerReady = true;
			const updateMaxH = () => {
				spMaxHeight = window.innerHeight - 16;
			};
			updateMaxH();
			window.addEventListener('resize', updateMaxH);
			if (formEl) {
				ro = new ResizeObserver((entries) => {
					const w = entries[0].contentRect.width;
					sizeClass = w < 420 ? 'xs' : w < 500 ? 'sm' : w < 660 ? 'md' : '';
				});
				ro.observe(formEl);
			}
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', () => {
				spMaxHeight = window.innerHeight - 16;
			});
		}
		if (ro && formEl) ro.disconnect();
		if (searchTimeoutId !== null) {
			clearTimeout(searchTimeoutId);
		}
	});
	onDestroy(() => {
		if (ro && formEl) ro.disconnect();
	});

	let searchTimeoutId: ReturnType<typeof setTimeout> | null = null;
	let lastSearchTime = 0;
	const SEARCH_RATE_LIMIT = 100;

	function runSearch() {
		const convertTriState = (value: number): 'any' | 'yes' | 'no' => {
			if (value === 1) return 'yes';
			if (value === -1) return 'no';
			return 'any';
		};

		const convertRingState = (value: number): 'any' | 'has' | 'no' => {
			if (value === 1) return 'has';
			if (value === -1) return 'no';
			return 'any';
		};

		const convertedResourceTri: Record<number, 'any' | 'yes' | 'no'> = {};
		for (const r of allResources) {
			convertedResourceTri[r] = convertTriState(resource_tri[r]);
		}

		search_results = searchUniverse(universe_data, {
			name: { query: name_box, mode: name_selected_type },
			ranmat: { query: ranmat_box, mode: ranmat_selected_type },
			coords: coord_box,
			resources: [],
			planetTypeFilters: planet_type_filters,
			starTypeFilters: star_type_filters,
			rings: convertRingState(ring_filter),
			atmosphere: convertTriState(atmosphere_filter),
			tidallyLocked: convertTriState(tidal_filter),
			temperatureRange: temperature_range,
			gravityRange: gravity_range,
			...({ resourcesTri: convertedResourceTri } as any),
			color: color_hex,
			colorSimilarity: color_similarity,
			secondaryColor: secondary_color_hex,
			secondaryColorSimilarity: secondary_color_similarity,
			earthlikesInSystem: convertTriState(earthlikes_filter)
		} as any);
	}

	function run() {
		const now = Date.now();
		
		if (searchTimeoutId !== null) {
			clearTimeout(searchTimeoutId);
		}

		if (now - lastSearchTime >= SEARCH_RATE_LIMIT) {
			lastSearchTime = now;
			runSearch();
		} else {
			searchTimeoutId = setTimeout(() => {
				lastSearchTime = Date.now();
				runSearch();
				searchTimeoutId = null;
			}, SEARCH_RATE_LIMIT - (now - lastSearchTime));
		}
	}

	function name_oninput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		name_box = e.currentTarget.value;
		run();
	}
	function name_type_oninput(e: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
		const v = e.currentTarget.value;
		name_selected_type =
			v === 'Starts with'
				? SearchType.StartsWith
				: v === 'Contains'
					? SearchType.Contains
					: SearchType.EndsWith;
		run();
	}
	function ranmat_oninput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		ranmat_box = e.currentTarget.value;
		run();
	}
	function ranmat_type_oninput(e: Event & { currentTarget: EventTarget & HTMLSelectElement }) {
		const v = e.currentTarget.value;
		ranmat_selected_type =
			v === 'Starts with'
				? SearchType.StartsWith
				: v === 'Contains'
					? SearchType.Contains
					: SearchType.EndsWith;
		run();
	}
	function coord_oninput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		coord_box = e.currentTarget.value;
		run();
	}

	function resetAllFilters() {
		name_box = '';
		ranmat_box = '';
		coord_box = '';
		name_selected_type = SearchType.StartsWith;
		ranmat_selected_type = SearchType.StartsWith;

		for (const key in PlanetType) {
			if (!isNaN(Number(key))) planet_type_filters[Number(key)] = 0;
		}
		for (const key in StarType) {
			if (!isNaN(Number(key))) star_type_filters[Number(key)] = 0;
		}

		ring_filter = 0;
		atmosphere_filter = 0;
		tidal_filter = 0;
		earthlikes_filter = 0;

		temperature_range = [-400, 400];
		gravity_range = [0, 400];

		for (const r of allResources) {
			resource_tri[r] = 0;
		}

		color_hex = '';
		color_similarity = 0;
		secondary_color_hex = '';
		secondary_color_similarity = 0;
		color_input = '';
		secondary_color_input = '';

		if (hexPickerEl) hexPickerEl.color = '';
		if (hexPickerSecondaryEl) hexPickerSecondaryEl.color = '';

		run();
	}
</script>

<Window
	bind:left
	bind:top
	bind:collapsed
	collapsible={true}
	minWidth={spMinWidth}
	maxWidth={spMaxWidth}
	width={spDefaultWidth}
	maxHeight={spMaxHeight}
>
	<span slot="title">Search</span>

	<div class="form {sizeClass}" bind:this={formEl}>
		<div class="pair">
		<section class="section card">
			<h3>Object Info</h3>
			<div class="row">
				<label class="field">
					<span class="label">Name</span>
					<input class="input" bind:value={name_box} on:input={name_oninput} placeholder="Search by name..." type="text" />
				</label>
				<label class="field narrow">
					<span class="label">Match</span>
					<select class="select" on:input={name_type_oninput}>
						{#each types as type}
							<option value={type} selected={type === types[name_selected_type]}>{type}</option>
						{/each}
					</select>
				</label>
			</div>

			<div class="row">
				<label class="field">
					<span class="label">Random material</span>
					<input class="input" bind:value={ranmat_box} on:input={ranmat_oninput} placeholder="e.g. Lodire" type="text" />
				</label>
				<label class="field narrow">
					<span class="label">Match</span>
					<select class="select" on:input={ranmat_type_oninput}>
						{#each types as type}
							<option value={type} selected={type === types[ranmat_selected_type]}>{type}</option>
						{/each}
					</select>
				</label>
			</div>

			<label class="field">
				<span class="label">Coordinates (X, Y, Z, W)</span>
				<input class="input" bind:value={coord_box} on:input={coord_oninput} placeholder="x, y, z, w" type="text" />
			</label>
		</section>

		<section class="section card">
			<h3>Primary Color</h3>
			<button
				type="button"
				class="swatch-row"
				on:click={() => (primaryPickerOpen = !primaryPickerOpen)}
				aria-expanded={primaryPickerOpen}
			>
				<span class="swatch" style:background={color_hex || 'transparent'}></span>
				<span class="swatch-hex">{color_hex || 'No color set'}</span>
				<span class="swatch-arrow">{primaryPickerOpen ? '▾' : '▸'}</span>
			</button>
			{#if primaryPickerOpen}
				<div class="color-row">
					{#if colorPickerReady}
						<hex-color-picker
							bind:this={hexPickerEl}
							color={color_hex}
							on:color-changed={(e: any) => {
								color_hex = e.detail.value;
								color_input = color_hex;
								run();
							}}
						></hex-color-picker>
					{/if}
					<div class="color-sim">
						<label class="field">
							<span class="label">Manual color</span>
							<input
								class="input"
								bind:value={color_input}
								on:input={color_text_oninput}
								placeholder="#ff8800 or rgb(255,136,0)"
							/>
						</label>
						<label class="field">
							<span class="label"
								>Color tolerance {color_similarity}% {color_similarity === 0 ? '(off)' : ''}</span
							>
							<input
								type="range"
								min="0"
								max="100"
								bind:value={color_similarity}
								on:input={() => run()}
							/>
						</label>
						<button
							type="button"
							class="clear"
							on:click={() => {
								color_hex = '';
								color_input = '';
								color_similarity = 0;
								run();
							}}>Clear</button
						>
					</div>
				</div>
			{/if}
			<h3>Secondary Color</h3>
			<button
				type="button"
				class="swatch-row"
				on:click={() => (secondaryPickerOpen = !secondaryPickerOpen)}
				aria-expanded={secondaryPickerOpen}
			>
				<span class="swatch" style:background={secondary_color_hex || 'transparent'}></span>
				<span class="swatch-hex">{secondary_color_hex || 'No color set'}</span>
				<span class="swatch-arrow">{secondaryPickerOpen ? '▾' : '▸'}</span>
			</button>
			{#if secondaryPickerOpen}
				<div class="color-row">
					{#if colorPickerReady}
						<hex-color-picker
							bind:this={hexPickerSecondaryEl}
							color={secondary_color_hex}
							on:color-changed={(e: any) => {
								secondary_color_hex = e.detail.value;
								secondary_color_input = secondary_color_hex;
								run();
							}}
						></hex-color-picker>
					{/if}
					<div class="color-sim">
						<label class="field">
							<span class="label">Manual color</span>
							<input
								class="input"
								bind:value={secondary_color_input}
								on:input={secondary_color_text_oninput}
								placeholder="#ff8800 or rgb(255,136,0)"
							/>
						</label>
						<label class="field">
							<span class="label"
								>Color tolerance {secondary_color_similarity}% {secondary_color_similarity === 0 ? '(off)' : ''}</span
							>
							<input
								type="range"
								min="0"
								max="100"
								bind:value={secondary_color_similarity}
								on:input={() => run()}
							/>
						</label>
						<button
							type="button"
							class="clear"
							on:click={() => {
								secondary_color_hex = '';
								secondary_color_input = '';
								secondary_color_similarity = 0;
								run();
							}}>Clear</button
						>
					</div>
				</div>
			{/if}
		</section>
		</div>

		<div class="pair">
		<section class="section card">
			<h3>Planet Type</h3>
			<div class="pill-wrap">
				{#each Object.keys(PlanetType).filter((k) => !isNaN(Number(k))) as key (key)}
					{#if !isNaN(Number(key))}
						<TriPill
							className="sm"
							label={PlanetType[Number(key)]}
							value={planet_type_filters[Number(key)]}
							onChange={(v) => {
								planet_type_filters[Number(key)] = v;
								run();
							}}
						/>
					{/if}
				{/each}
			</div>
		</section>

		<section class="section card">
			<h3>Star Type</h3>
			<div class="star-grid">
				{#each Object.keys(StarType).filter((k) => !isNaN(Number(k))) as key (key)}
					{#if !isNaN(Number(key))}
						<TriPill
							className="sm"
							label={StarType[Number(key)]}
							value={star_type_filters[Number(key)]}
							onChange={(v) => {
								star_type_filters[Number(key)] = v;
								run();
							}}
						/>
					{/if}
				{/each}
			</div>
		</section>
		</div>

		<div class="pair">
		<section class="section card">
			<h3>Range Filters</h3>
			<div class="sub">
				<h4>Temperature ({temperature_range[0]} to {temperature_range[1]})</h4>
				<div class="unscaled">
					<RangeSlider
						min={-400}
						max={400}
						values={temperature_range}
						range
						on:change={(e) => {
							temperature_range = e.detail.values;
							run();
						}}
						class="rs"
					/>
				</div>
			</div>
			<div class="sub">
				<h4>Gravity ({gravity_range[0]}g to {gravity_range[1]}g)</h4>
				<div class="unscaled">
					<RangeSlider
						min={0}
						max={400}
						values={gravity_range}
						range
						on:change={(e) => {
							gravity_range = e.detail.values;
							run();
						}}
						class="rs"
					/>
				</div>
			</div>
		</section>

		<section class="section card compact4">
			<h3>Toggles</h3>
			<div class="sub">
				<h4>Atmosphere</h4>
				<TriStateFilter
					value={atmosphere_filter}
					onChange={(newValue) => {
						atmosphere_filter = newValue;
						run();
					}}
					className="sm"
				/>
			</div>
			<div class="sub">
				<h4>Rings</h4>
				<TriStateFilter
					value={ring_filter}
					onChange={(newValue) => {
						ring_filter = newValue;
						run();
					}}
					yesLabel="Has"
					className="sm"
				/>
			</div>
			<div class="sub">
				<h4>Tidally Locked</h4>
				<TriStateFilter
					value={tidal_filter}
					onChange={(newValue) => {
						tidal_filter = newValue;
						run();
					}}
					className="sm"
				/>
			</div>
			<div class="sub">
				<h4>Earthlikes</h4>
				<TriStateFilter
					value={earthlikes_filter}
					onChange={(newValue) => {
						earthlikes_filter = newValue;
						run();
					}}
					className="sm"
				/>
			</div>
		</section>
		</div>

		<section class="section card">
			<h3>Resources</h3>
			<div class="res-grid">
				{#each allResources as r}
					<TriPill
						label={Resource[r]}
						value={resource_tri[r]}
						onChange={(v) => {
							resource_tri[r] = v;
							run();
						}}
					/>
				{/each}
			</div>
		</section>

		<div class="footer">
			<button type="button" class="footer-btn" on:click={() => (collapsed = true)}>
				Close
			</button>
			<div class="footer-right">
				<button type="button" class="footer-btn" on:click={resetAllFilters}>
					Reset All
				</button>
			</div>
		</div>
	</div>
</Window>

<style>
	.form {
		display: grid;
		gap: calc(0.6rem * var(--ui-scale));
	}
	.row {
		display: grid;
		grid-template-columns: 1fr minmax(8rem, 30%);
		gap: calc(0.5rem * var(--ui-scale));
		align-items: end;
	}
	.form.md .row {
		grid-template-columns: 1fr minmax(9rem, 34%);
	}
	.form.sm .row {
		grid-template-columns: 1fr 42%;
	}
	.form.xs .row {
		grid-template-columns: 1fr;
	}
	.form.xs .field.narrow {
		width: 100%;
	}
	.form.xs .section.compact4 {
		grid-template-columns: 1fr;
	}
	.form.md .star-grid {
		grid-template-columns: repeat(2, 1fr);
	}
	.form.sm .star-grid {
		grid-template-columns: repeat(2, 1fr);
	}
	.form.xs .star-grid {
		grid-template-columns: 1fr;
	}
	.form.xs .res-grid {
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
	}
	.form.sm .res-grid {
		grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr));
	}
	.form.md .res-grid {
		grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
	}

	.pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: calc(0.6rem * var(--ui-scale));
		align-items: start;
	}
	.form.sm .pair,
	.form.xs .pair {
		grid-template-columns: 1fr;
	}

	/* card */
	.card {
		background: color-mix(in oklab, var(--t-surface) 60%, transparent);
		border: 1px solid var(--t-border);
		border-radius: var(--t-radius);
		padding: calc(0.75rem * var(--ui-scale));
	}
	.card.compact4 {
		grid-template-columns: repeat(2, 1fr);
	}

	.field {
		display: grid;
		gap: calc(0.3rem * var(--ui-scale));
	}
	.field.narrow {
		width: 100%;
	}
	.label {
		font-family: var(--t-font-mono);
		font-size: calc(0.68rem * var(--ui-scale));
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--t-text-dim);
	}
	.input,
	.select {
		appearance: none;
		border: none;
		border-bottom: 1px solid var(--t-border);
		border-radius: 0;
		background: transparent;
		color: var(--t-text);
		font-family: var(--t-font-body);
		padding: calc(0.4rem * var(--ui-scale)) calc(0.1rem * var(--ui-scale));
		line-height: 1.1;
		transition: border-color 0.15s ease, box-shadow 0.15s ease;
	}
	.input::placeholder {
		color: var(--t-text-dim);
		opacity: 0.8;
	}
	.input:hover,
	.select:hover {
		border-color: var(--t-primary);
	}
	.input:focus-visible,
	.select:focus-visible {
		outline: none;
		border-color: var(--t-primary);
		box-shadow: 0 1px 0 0 var(--t-primary), 0 0 6px 0 color-mix(in oklab, var(--t-primary) 60%, transparent);
	}

	.section {
		display: grid;
		gap: calc(0.6rem * var(--ui-scale));
	}
	.section.compact4 {
		grid-template-columns: repeat(2, 1fr);
		gap: calc(0.6rem * var(--ui-scale));
	}
	.sub {
		display: grid;
		gap: calc(0.4rem * var(--ui-scale));
	}
	h3 {
		margin: 0 0 calc(0.4rem * var(--ui-scale));
		padding-bottom: calc(0.35rem * var(--ui-scale));
		border-bottom: 1px solid var(--t-border);
		font-family: var(--t-font-mono);
		font-size: calc(0.72rem * var(--ui-scale));
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--t-primary-text);
	}
	.compact4 h3 {
		grid-column: 1 / -1;
	}
	h4 {
		margin: 0;
		font-family: var(--t-font-mono);
		font-size: calc(0.66rem * var(--ui-scale));
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--t-text-dim);
	}

	.pill-wrap {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.4rem;
	}
	.pill-wrap :global(.tri-pill) {
		width: 100%;
		justify-content: flex-start;
	}
	.form.md .pill-wrap {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.form.sm .pill-wrap {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	.form.xs .pill-wrap {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	.star-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.3rem;
	}
	.form.md .star-grid {
		grid-template-columns: repeat(3, 1fr);
	}
	.form.sm .star-grid {
		grid-template-columns: repeat(3, 1fr);
	}
	.form.xs .star-grid {
		grid-template-columns: repeat(2, 1fr);
	}

	.res-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
		gap: 0.4rem;
	}
	.res-grid :global(.tri-pill) {
		width: 100%;
		justify-content: flex-start;
	}

	:global(.rs .range-slider__track) {
		background: var(--t-border) !important;
		height: 2px;
		border-radius: 0;
	}
	:global(.rs .range-slider__range) {
		background: var(--t-primary) !important;
	}
	:global(.rs .range-slider__thumb) {
		background: var(--t-primary) !important;
		border: 2px solid var(--t-surface) !important;
		width: 0.85rem;
		height: 0.85rem;
	}
	:global(.rs .range-slider__pips) {
		display: none;
	}

	.swatch-row {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		padding: calc(0.4rem * var(--ui-scale)) calc(0.5rem * var(--ui-scale));
		border: 1px solid var(--t-border);
		border-radius: var(--t-radius-sm);
		background: transparent;
		color: var(--t-text);
		cursor: pointer;
		margin-bottom: calc(0.5rem * var(--ui-scale));
	}
	.swatch-row:hover {
		border-color: var(--t-primary);
	}
	.swatch {
		width: 1.1rem;
		height: 1.1rem;
		border-radius: var(--t-radius-sm);
		border: 1px solid var(--t-border);
		flex: 0 0 auto;
	}
	.swatch-hex {
		font-family: var(--t-font-mono);
		font-size: calc(0.78rem * var(--ui-scale));
		flex: 1;
		text-align: left;
	}
	.swatch-arrow {
		color: var(--t-text-dim);
		font-size: 0.7rem;
	}

	.color-row {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	hex-color-picker {
		width: 110px;
		height: 110px;
	}
	.color-sim {
		display: grid;
		gap: 0.5rem;
		align-items: start;
	}
	.color-sim input[type='range'] {
		width: 160px;
		accent-color: var(--t-primary);
	}
	button.clear {
		border: 1px solid var(--t-border);
		background: transparent;
		color: var(--t-text-dim);
		padding: 0.3rem 0.6rem;
		border-radius: var(--t-radius-sm);
		font-family: var(--t-font-mono);
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		cursor: pointer;
	}
	button.clear:hover {
		border-color: var(--t-primary);
		color: var(--t-text);
	}

	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: calc(0.6rem * var(--ui-scale));
		border-top: 1px solid var(--t-border);
	}
	.footer-right {
		display: flex;
		gap: calc(0.5rem * var(--ui-scale));
	}
	.form.xs .footer {
		flex-direction: column-reverse;
		align-items: stretch;
		gap: calc(0.5rem * var(--ui-scale));
	}
	.form.xs .footer-right {
		flex-direction: column;
	}
	.footer-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: calc(0.5rem * var(--ui-scale)) calc(0.9rem * var(--ui-scale));
		border: 1px solid var(--t-border);
		background: transparent;
		color: var(--t-text-dim);
		border-radius: var(--t-radius-sm);
		font-family: var(--t-font-mono);
		font-size: calc(0.72rem * var(--ui-scale));
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 0.15s ease;
	}
	.footer-btn svg {
		width: 1rem;
		height: 1rem;
	}
	.footer-btn:hover {
		border-color: var(--t-primary);
		color: var(--t-text);
	}
	.footer-btn:active {
		transform: scale(0.98);
	}
</style>
