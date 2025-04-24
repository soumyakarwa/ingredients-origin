<script lang="ts">
	// CODE FOR DRAGGABLE GLOBE BUILT ON https://svelte.dev/playground/9617e79b67fb4f48a0f744f6714b62a3?version=4.1.1
	import countries from '$lib/data/map.topojson.json';
	import ingredients from '$lib/data/ingredients.json';
	import IngredientIcon2 from '$lib/components/IngredientIcon2.svelte';
	import { getCoords } from './utils/getCoords';
	import { geoOrthographic, geoPath, drag } from 'd3';
	import { feature } from 'topojson-client';
	import { onMount } from 'svelte';

	const earthRotation = 11.75;
	let width = $state(1000);
	let heightProportion = 1;
	let height = $derived(width * heightProportion);

	let rotation: [number, number, number] = $state([0, 0, earthRotation]);
	let globe = $state();
	let animationFrame = $state();

	let margin = { top: 20, left: 20, right: 20, bottom: 20 };
	let innerWidth = $derived(width - margin.right - margin.left);
	let innerHeight = $derived(width - margin.bottom - margin.top);

	const countriesGeojson = feature(countries, countries.objects.countries);
	const land = feature(countries, countries.objects.land);
	let projection = $derived(
		geoOrthographic().fitSize([innerWidth, innerHeight], countriesGeojson).rotate(rotation)
	);
	let path = $derived(geoPath().projection(projection));

	const dragged = (event) => {
		const dx = event.dx;
		const dy = event.dy;
		const currentRotation = projection.rotate();
		const radius = projection.scale();
		const scale = 360 / (2 * Math.PI * radius);

		rotation = [
			currentRotation[0] + dx * scale,
			currentRotation[1] - dy * scale,
			currentRotation[2]
		];

		projection.rotate(rotation);
	};

	const dragHandler = drag().on('drag', (event) => {
		dragged({ dx: event.dx, dy: event.dy });
	});

	const autoRotate = () => {
		const speed = 0.05;

		const update = () => {
			rotation[0] += speed;
			animationFrame = requestAnimationFrame(update);
		};

		animationFrame = requestAnimationFrame(update);
	};

	const isVisible = (coords: [number, number]): boolean => {
		// const [x, y, z] = projection.rotate(); // get the rotation
		const [lng, lat] = coords;

		// convert both to radians
		const lambda = lng * (Math.PI / 180);
		const phi = lat * (Math.PI / 180);
		const lambda0 = -rotation[0] * (Math.PI / 180);

		// dot product check (z > 0 means facing forward)
		const cosc =
			Math.sin(phi) * Math.sin(0) + Math.cos(phi) * Math.cos(0) * Math.cos(lambda - lambda0);
		return cosc > 0;
	};

	onMount(() => {
		autoRotate();
		// dragHandler(globe);
		return () => {
			cancelAnimationFrame(animationFrame);
		};
	});

	$effect(() => {});
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="flex w-full flex-row gap-2">
		<div class="relative h-full w-1/2" bind:clientWidth={width}>
			<svg {width} {height} preserveAspectRatio="xMidYMid meet">
				<g class="origin-center" transform={`translate(${margin.left}, ${margin.top})`}>
					<path bind:this={globe} d={path({ type: 'Sphere' })} fill="#9eeef1" stroke="#000" />
					<path d={path(land)} fill="#fff6d8" stroke="#000" />
					{#each ingredients as ingredient, i}
						{@const lngLat = getCoords(ingredient.country.coords)}
						{@const coords = projection(lngLat)}
						{@const visible = isVisible(lngLat)}
						<IngredientIcon2 {ingredient} {coords} {i} {visible} />
					{/each}
				</g>
			</svg>
		</div>
		<div>INGREDIENT INFO</div>
	</div>
</div>
