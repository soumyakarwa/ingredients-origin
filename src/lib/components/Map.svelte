<script lang="ts">
	import topojsonData from '$lib/data/map.topojson.json';
	import { feature, merge } from 'topojson-client';
	import {
		geoNaturalEarth1,
		geoPath,
		type GeoProjection,
		type GeoPath,
		line,
		curveBasis,
		select,
		min,
		max
	} from 'd3';
	// import { getCoords } from './utils/getCoords';
	// import { countryData } from '$lib/stores';

	// interface Props {
	// 	countries: any[];
	// }

	// let { countries }: Props = $props();

	let width = $state(1000);
	let heightProportion = 0.5625;
	let mapHeight = $state(0);
	let height = $derived(width * heightProportion);

	let topojsonFiltered = $state(topojsonData);

	topojsonFiltered.objects.countries.geometries =
		topojsonFiltered.objects.countries.geometries.filter(
			(geom) => geom.id !== '010' && geom.properties?.iso_a3 !== 'ATA'
		);

	const countriesGeojson = feature(topojsonFiltered, topojsonFiltered.objects.countries);
	const landGeoJson = merge(topojsonFiltered, topojsonFiltered.objects.countries.geometries);
	//
	let projectionFn: GeoProjection = $derived(
		geoNaturalEarth1().fitSize([width, height], countriesGeojson)
	);
	let geoPathFn: GeoPath = $derived(geoPath(projectionFn));

	const arcLine = line()
		.x((d) => d[0])
		.y((d) => d[1])
		.curve(curveBasis);

	// getCoords($countryData, 'Mexico');
	// $inspect($countryData);

	let mexico: [number, number] = $derived(projectionFn([-102.5528, 23.6345]));
	let spain: [number, number] = $derived(projectionFn([-3.70379, 40.416775]));

	const controlX = $derived((mexico[0] + spain[0]) / 2);
	const controlY = $derived(Math.min(mexico[1], spain[1]) + 80); // peak 100 units above

	const pathD = $derived(arcLine([mexico, [controlX, controlY], spain]));
</script>

<div class="w-full bg-blue-100" bind:clientWidth={width} style:height="{height}px">
	<svg {width} {height}>
		<filter id="noise">
			<feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="2" />
			<feDisplacementMap in="SourceGraphic" scale="5" />
		</filter>
		<g class="country-outline" bind:clientHeight={mapHeight}>
			<path
				class="linear fill-yellow-100 stroke-black stroke-1 transition-[opacity] duration-300"
				role="presentation"
				d={geoPathFn(landGeoJson)}
				filter="url(#noise)"
			/>
		</g>
		<path d={pathD} fill="none" stroke="black" stroke-width="1" stroke-dasharray="4 2" />

		<circle id={'mexico'} cx={mexico[0]} cy={mexico[1]} r={3} fill="red" />
		<circle id={'uk'} cx={spain[0]} cy={spain[1]} r={3} fill="blue" />
	</svg>
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
