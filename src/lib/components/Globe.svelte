<script lang="ts">
	// CODE FOR DRAGGABLE GLOBE BUILT ON https://svelte.dev/playground/9617e79b67fb4f48a0f744f6714b62a3?version=4.1.1
	import countries from '$lib/data/map.topojson.json';
	import ingredients from '$lib/data/ingredients.json';
	import InfoTooltip from '$lib/components/InfoTooltip.svelte';
	import IngredientIcon from '$lib/components/IngredientIcon.svelte';
	import MyButton from '$lib/components/MyButton.svelte';
	import { isVisible } from '$lib/components/utils/isVisible';
	import { getCoords } from '$lib/components/utils/getCoords';
	import { getArcSegment } from '$lib/components/utils/routeHelper';
	import { geoOrthographic, geoPath, drag, select } from 'd3';
	import { feature } from 'topojson-client';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	interface Props {
		ingredientId: string;
	}

	let { ingredientId = $bindable() }: Props = $props();

	// CONSTANTS AND STATE VARIABLES
	const earthRotation = 11.75;
	let width = $state(1000);
	let heightProportion = 1;
	let height = $derived(width * heightProportion);
	let rotation: [number, number, number] = $state([0, 0, earthRotation]);
	let globe: Element | null = $state();
	let animationFrame: number = $state();
	let isDragging = $state(false);
	let letRotate = $state(true);
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

	const routeCoords = $derived(
		activeIndex != null ? ingredients[activeIndex].route.map((country) => getCoords(country)) : null
	);
	const arcCoords = $derived.by(() => {
		if (routeCoords && routeCoords.length > 1) {
			let arc: [number, number][] = [];

			for (let i = 0; i < routeCoords.length - 1; i++) {
				arc.push(...getArcSegment(routeCoords[i], routeCoords[i + 1]));
			}
			return arc;
		}
		return null;
	});

	const arcLine = $derived({
		type: 'LineString',
		coordinates: arcCoords
	});

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
	const dragHandler = drag()
		.on('drag', (event) => {
			isDragging = true;
			letRotate = false;
			cancelAnimationFrame(animationFrame);
			dragged({ dx: event.dx, dy: event.dy });
		})
		.on('end', () => {
			if (activeIndex == null) {
				autoRotate();
			}
		});

	const autoRotate = () => {
		const speed = 0.05;

		const update = () => {
			if (letRotate) {
				rotation[0] += speed;
				projection.rotate(rotation);
			}
			animationFrame = requestAnimationFrame(update);
		};

		animationFrame = requestAnimationFrame(update);
	};

	onMount(() => {
		autoRotate();
		select(globe).call(dragHandler);
		return () => {
			cancelAnimationFrame(animationFrame);
		};
	});

	$effect(() => {
		ingredientId = activeIndex ? ingredients[activeIndex].id : '';
	});
</script>

<div class="flex w-full flex-row gap-2">
	<div class="relative h-full w-1/2" bind:clientWidth={width}>
		<svg bind:this={globe} {width} {height} preserveAspectRatio="xMidYMid meet">
			<defs>
				<filter id="noiseFilter" x="-20%" y="-20%" width="140%" height="140%">
					<!-- generate a noise pattern -->
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.02 0.02"
						numOctaves="2"
						result="noise"
					/>
					<!-- push your graphic through the noise field -->
					<feDisplacementMap
						in="SourceGraphic"
						in2="noise"
						scale="2"
						xChannelSelector="R"
						yChannelSelector="G"
					/>
				</filter>
			</defs>
			<g class="origin-center" transform={`translate(${margin.left}, ${margin.top})`}>
				<path
					bind:this={globe}
					d={path({ type: 'Sphere' })}
					fill="var(--color-blue-100)"
					stroke="#000"
				/>
				<path d={path(land)} fill="var(--color-green-100)" stroke="#000" stroke-width={'0.5'} />
				{#each ingredients as ingredient, i}
					{@const lngLat = getCoords(ingredient.country.coords)}
					{@const coords = projection(lngLat)}
					{@const visible = isVisible(lngLat, -rotation[0])}
					<IngredientIcon
						x={coords[0]}
						y={coords[1]}
						{visible}
						isActive={activeIndex == i}
						name={ingredient.name}
						id={ingredient.id}
						onClickFn={() => {
							if (visible) {
								if (activeIndex == i) {
									activeIndex = null;
									letRotate = true;
								} else {
									activeIndex = i;
									letRotate = false;
								}
							}
						}}
					/>
				{/each}
				{#if arcCoords}
					<path
						d={path(arcLine)}
						class="animate-dash fill-none stroke-black stroke-[0.25] lg:stroke-1"
						style="stroke-dasharray: 1000; stroke-dashoffset: 1000;"
						filter="url(#noiseFilter)"
					/>
				{/if}
				{#each routeCoords as coords, i}
					{@const visible = isVisible(coords, -rotation[0])}
					{#if visible}
						{@const [x, y] = projection(coords)}
						<circle
							cx={x}
							cy={y}
							r={3}
							fill="var(--color-yellow-100)"
							transition:fade={{ duration: 300, delay: i * 10000, easing: linear }}
						/>
						<text
							{x}
							{y}
							transform={`translate(${5}, ${0})`}
							class="heading-2 font-semibold uppercase"
							stroke="var(--color-black)"
							stroke-width={0.4}
							fill="var(--color-white)"
							transition:fade={{ duration: 300, delay: i * 10000, easing: linear }}
							style="pointer-events: none;">{ingredients[activeIndex].route[i]}</text
						>
					{/if}
				{/each}
			</g>
		</svg>
		<div class="absolute bottom-0 left-0">
			<MyButton
				label={'Rotate'}
				state={!letRotate ? 'default' : 'active'}
				aria-label={'button to drag and rotate'}
				onClickFn={() => {
					if (activeIndex == null) {
						letRotate = true;
					}
				}}
			></MyButton>
		</div>
	</div>
	<div class="h-full w-1/2 self-center">
		<InfoTooltip
			ingredient={ingredients[activeIndex]}
			bind:activeIndex
			bind:value={infoTooltipState}
		/>
	</div>
</div>
