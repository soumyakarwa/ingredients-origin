<script lang="ts">
	import topojsonData from '$lib/data/map-geometric.topojson.json';
	import ingredients from '$lib/data/ingredients.json';
	import InfoTooltip from '$lib/components/InfoTooltip.svelte';
	import IngredientIcon from '$lib/components/IngredientIcon.svelte';
	import RouteLabel from '$lib/components/RouteLabel.svelte';
	import { feature, merge } from 'topojson-client';
	import {
		geoNaturalEarth1,
		geoPath,
		type GeoProjection,
		type GeoPath,
		curveBasis,
		curveCatmullRom,
		line
	} from 'd3';
	import { getCoords } from './utils/getCoords';
	import { createPath } from './utils/createPath';
	import { fly, fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	let width = $state(1000);
	let heightProportion = 0.52;
	let height = $derived(width * heightProportion);

	let topojsonFiltered = $state(topojsonData);

	topojsonFiltered.objects.countries.geometries =
		topojsonFiltered.objects.countries.geometries.filter((geom) => geom.id !== '010');
	const countriesGeojson = feature(topojsonFiltered, topojsonFiltered.objects.countries);
	const landGeoJson = merge(topojsonFiltered, topojsonFiltered.objects.countries.geometries);

	let projectionFn: GeoProjection = $derived(
		geoNaturalEarth1().fitSize([width, height], countriesGeojson)
	);
	let geoPathFn: GeoPath = $derived(geoPath(projectionFn));

	let infoTooltipState = $state<'inactive' | 'active'>('inactive');
	let activeIndex = $state<number | null>(null);
</script>

<div class="relative w-full bg-blue-100" bind:clientWidth={width} style:height="{height}px">
	<svg {width} {height}>
		<!-- <filter id="noise">
			<feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" />
			<feDisplacementMap in="SourceGraphic" scale="5" />
		</filter> -->
		<filter id="routeNoise">
			<feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="4" />
			<feDisplacementMap in="SourceGraphic" scale="1" />
		</filter>
		<g class="country-outline">
			<path
				class="linear fill-yellow-100 stroke-black stroke-[0.25] transition-[opacity] duration-300 lg:stroke-1"
				role="presentation"
				d={geoPathFn(landGeoJson)}
			/>
		</g>
		{#key activeIndex}
			{#if activeIndex != null}
				{@const routeCoords = ingredients[activeIndex].route.map((country) =>
					projectionFn(getCoords(country))
				)}
				{#if routeCoords.length > 1}
					<path
						d={createPath(routeCoords)}
						class="animate-dash fill-none stroke-black stroke-[0.25] lg:stroke-1"
						style="stroke-dasharray: 1000; stroke-dashoffset: 1000;"
						filter="url(#routeNoise)"
					/>
				{/if}
				{#each routeCoords as [x, y], i}
					<circle
						cx={x}
						cy={y}
						r={3}
						class="fill-red-100"
						in:fade={{ duration: 300, delay: i * 10000, easing: linear }}
					/>
				{/each}
			{/if}
		{/key}
	</svg>

	{#each ingredients as ingredient, i}
		{@const coords = projectionFn(getCoords(ingredient.country.coords))}
		<IngredientIcon {ingredient} {coords} {i} bind:activeIndex />
	{/each}

	{#if activeIndex != null}
		{@const coords = projectionFn(getCoords(ingredients[activeIndex].country.coords))}
		<RouteLabel route={ingredients[activeIndex].route} {projectionFn} />
		<InfoTooltip
			ingredient={ingredients[activeIndex]}
			bind:activeIndex
			bind:value={infoTooltipState}
			{coords}
		/>
	{/if}
</div>
