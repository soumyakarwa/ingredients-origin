<script lang="ts">
	import { getCoords } from '$lib/components/utils/getCoords';
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	interface Props {
		projectionFn: (country: string) => [number, number];
		route: string[];
	}

	let { route, projectionFn }: Props = $props();

	const translateText = (coords: [number, number], i: number): string => {
		if (i === 0 || i === route.length - 1) {
			return '-translate-x-1/2 -translate-y-full'; // center it above
		} else {
			const nextRouteStepCoords = projectionFn(getCoords(route[i + 1]));
			const [x, y] = [nextRouteStepCoords[0], nextRouteStepCoords[1]];
			const [centerX, centerY] = coords;
			const dx = x - centerX;
			const dy = y - centerY;

			if (dx < 0 && dy < 0) return 'translate-x-0 translate-y-0'; // top-left
			if (dx > 0 && dy < 0) return '-translate-x-full translate-y-0'; // top-right
			if (dx < 0 && dy > 0) return 'translate-x-0 -translate-y-full'; // bottom-left
			if (dx > 0 && dy > 0) return '-translate-x-full -translate-y-full'; // bottom-right

			return '-translate-x-1/2 -translate-y-1/2'; // fallback to center
		}
	};
</script>

{#each route as country, i}
	{@const coords = projectionFn(getCoords(country))}
	<div
		style={`left:${coords[0]}px; top:${coords[1]}px;`}
		class={['heading-2 absolute font-semibold text-black', translateText(coords, i)]}
	>
		{country}
	</div>
{/each}
