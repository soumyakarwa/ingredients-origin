<script lang="ts">
	import { getCoords } from '$lib/components/utils/getCoords';
	import { onMount } from 'svelte';

	interface Props {
		projectionFn: (country: string) => [number, number];
		route: string[];
	}

	interface RouteLabel {
		x: number;
		y: number;
		country: string;
		class: string;
	}

	let { route, projectionFn }: Props = $props();

	let routeLabelHelper: RouteLabel[] = $state([]);

	const getQuadrant = (x: number, y: number, centerX: number, centerY: number): string => {
		const dx = x - centerX;
		const dy = y - centerY;

		if (dx < 0 && dy < 0) return 'top-left';
		if (dx > 0 && dy < 0) return 'top-right';
		if (dx < 0 && dy > 0) return 'bottom-left';
		if (dx > 0 && dy > 0) return 'bottom-right';

		return 'center';
	};

	const translateText = (coords: [number, number], i: number): string => {
		if (i === 0 || i === route.length - 1) {
			return '-translate-x-1/2 -translate-y-2 lg:-translate-y-5'; // center it above
		} else {
			const nextRouteStepCoords = projectionFn(getCoords(route[i + 1]));
			const [x, y] = [nextRouteStepCoords[0], nextRouteStepCoords[1]];
			const [centerX, centerY] = coords;
			const dx = x - centerX;
			const dy = y - centerY;
			console.log(dx, dy);

			if (dx < 0 && dy < 0) return 'translate-x-0 translate-y-0'; // top-left
			if (dx > 0 && dy < 0) return '-translate-x-full translate-y-0'; // top-right
			if (dx < 0 && dy > 0) return 'translate-x-0 -translate-y-full'; // bottom-left
			if (dx > 0 && dy > 0) return '-translate-x-full -translate-y-full'; // bottom-right

			return '-translate-x-1/2 -translate-y-1/2'; // fallback to center
		}
	};

	onMount(() => {
		route.forEach((r, i) => {
			const coords = projectionFn(getCoords(r));
			routeLabelHelper.push({
				x: coords[0],
				y: coords[1],
				country: r,
				class: ''
			});
		});
	});

	$inspect(routeLabelHelper);
</script>

{#each route as country, i}
	{@const coords = projectionFn(getCoords(country))}
	<div
		style={`left:${coords[0]}px; top:${coords[1]}px;`}
		class={['heading-2 absolute fill-black', translateText(coords, i)]}
	>
		{country}
	</div>
{/each}
