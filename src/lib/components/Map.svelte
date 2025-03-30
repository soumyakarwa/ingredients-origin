<script lang="ts">
	import topojsonData from '$lib/data/map.topojson.json';
	import ingredients from '$lib/data/ingredients.json';
	import IngredientIcon from '$lib/components/IngredientIcon.svelte';
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
	import { onMount, tick } from 'svelte';

	let width = $state(1000);
	let heightProportion = 0.52;
	let height = $derived(width * heightProportion);

	let topojsonFiltered = $state(topojsonData);

	topojsonFiltered.objects.countries.geometries =
		topojsonFiltered.objects.countries.geometries.filter((geom) => geom.id !== '010');

	const countriesGeojson = feature(topojsonFiltered, topojsonFiltered.objects.countries);
	const landGeoJson = merge(topojsonFiltered, topojsonFiltered.objects.countries.geometries);
	//
	let projectionFn: GeoProjection = $derived(
		geoNaturalEarth1().fitSize([width, height], countriesGeojson)
	);
	let geoPathFn: GeoPath = $derived(geoPath(projectionFn));

	// let pathRefs: SVGPathElement[] = $state([]);

	// function animatePaths() {
	// 	pathRefs.forEach(async (path: SVGPathElement) => {
	// 		const length = path.getTotalLength();
	// 		console.log(length);
	// 		path.style.strokeDasharray = length.toString();
	// 		path.style.strokeDashoffset = length.toString();
	// 		await tick(); // wait for DOM update

	// 		path.style.transition = 'stroke-dashoffset 1s ease-out';
	// 		path.style.strokeDashoffset = '0';
	// 	});
	// }

	// onMount(() => {
	// 	animatePaths();
	// });
</script>

<div class="relative w-full bg-blue-100" bind:clientWidth={width} style:height="{height}px">
	<svg {width} {height}>
		<filter id="noise">
			<feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" />
			<feDisplacementMap in="SourceGraphic" scale="5" />
		</filter>
		<g class="country-outline">
			<path
				class="linear fill-yellow-100 stroke-black stroke-[0.25] transition-[opacity] duration-300 lg:stroke-1"
				role="presentation"
				d={geoPathFn(landGeoJson)}
				filter="url(#noise)"
			/>
		</g>
		{#each ingredients as ingredient, i}
			{@const routeCoords = ingredient.route.map((country) => projectionFn(getCoords(country)))}
			<path
				d={createPath(routeCoords)}
				class="fill-none stroke-black stroke-[0.25] lg:stroke-1"
				stroke-dasharray="3 4"
			/>
			{#each routeCoords as [x, y], i}
				<circle cx={x} cy={y} r={3} class="fill-red-100" />
			{/each}
		{/each}
	</svg>

	{#each ingredients as ingredient, i}
		{@const coords = projectionFn(getCoords(ingredient.country))}
		<IngredientIcon {ingredient} {coords} />
		{#each ingredient.route as country, i}
			{@const routeCoords = projectionFn(getCoords(country))}
			<div
				style={`left:${routeCoords[0]}px; top:${routeCoords[1]}px;`}
				class="heading-2 absolute fill-black"
			>
				{country}
			</div>
		{/each}
	{/each}
</div>

<!-- @keyframes draw {
    from {
      stroke-dashoffset: 400;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  .animate-draw {
    animation: draw 3s ease-in-out forwards; /* Adjust timing as needed */
  } -->
