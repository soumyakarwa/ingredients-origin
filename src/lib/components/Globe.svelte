<script lang="ts">
	// CODE FOR DRAGGABLE GLOBE BUILT ON https://svelte.dev/playground/9617e79b67fb4f48a0f744f6714b62a3?version=4.1.1
	import countries from '$lib/data/map.topojson.json';
	import ingredients from '$lib/data/ingredients.json';
	import HoverTooltip from './HoverTooltip.svelte';
	import InfoTooltip from '$lib/components/InfoTooltip.svelte';
	import NumberFlow, { continuous } from '@number-flow/svelte';
	import { isVisible } from '$lib/components/utils/isVisible';
	import { getRandomOffset } from '$lib/components/utils/getRandomOffset';
	import { getCoords } from '$lib/components/utils/getCoords';
	import { icons } from '$lib/stores';
	import { geoOrthographic, geoPath, drag } from 'd3';
	import { feature } from 'topojson-client';
	import { onMount } from 'svelte';

	// CONSTANTS AND STATE VARIABLES
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
	let hoveredIndex: number | null = $state(null);
	let activeIndex = $state<number | null>(null);
	let infoTooltipState = $state<'inactive' | 'active'>('inactive');
	const countriesGeojson = feature(countries, countries.objects.countries);
	const land = feature(countries, countries.objects.land);

	// PROJECTION FUNCTION FOR MAP
	let projection = $derived(
		geoOrthographic().fitSize([innerWidth, innerHeight], countriesGeojson).rotate(rotation)
	);
	let path = $derived(geoPath().projection(projection));

	// HELPER FUNCTIONS
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
			if (!hoveredIndex || !activeIndex) {
				rotation[0] += speed;
			}

			animationFrame = requestAnimationFrame(update);
		};

		animationFrame = requestAnimationFrame(update);
	};

	onMount(() => {
		autoRotate();
		// dragHandler(globe);
		return () => {
			cancelAnimationFrame(animationFrame);
		};
	});

	// $inspect(hoveredIndex);
	$effect(() => {
		// if (hoveredIndex == null) {
		// 	autoRotate();
		// }
	});
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
						{@const visible = isVisible(lngLat, -rotation[0])}
						{@const imageSrc =
							icons[`/src/lib/assets/ingredient-icons/${ingredient.id}.svg`]?.default ?? 'null'}
						<image
							x={coords[0]}
							y={coords[1]}
							href={imageSrc}
							transform={getRandomOffset()}
							class={['h-auto w-2 cursor-pointer lg:w-4', visible ? 'opacity-100' : 'opacity-0']}
							role="presentation"
							aria-describedby={`${ingredient.name} img`}
							onmouseenter={() => {
								hoveredIndex = i;
							}}
							onmouseleave={() => {
								hoveredIndex = null;
							}}
							onclick={() => {
								activeIndex = i;
								// isHovering = false; [this prevents another ingredient to be clicked while one's info is already open]
							}}
						/>
						{#if hoveredIndex === i}
							<HoverTooltip name={ingredient.name} country={ingredient.country.label} {coords} />
						{/if}
					{/each}
				</g>
			</svg>
		</div>
		<div>
			{#if activeIndex != null}
				<!-- <RouteLabel route={ingredients[activeIndex].route} {projectionFn} /> -->
				<InfoTooltip
					ingredient={ingredients[activeIndex]}
					bind:activeIndex
					bind:value={infoTooltipState}
				/>
			{/if}
		</div>
	</div>
</div>
