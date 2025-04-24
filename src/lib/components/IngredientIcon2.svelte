<script lang="ts">
	import HoverTooltip from '$lib/components/HoverTooltip.svelte';
	import { icons } from '$lib/stores';
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	interface Props {
		ingredient: Ingredient;
		coords: number[];
		visible: boolean;
		i: number;
		// activeIndex: number | null;
	}

	let { ingredient, coords, i, visible = false }: Props = $props();
	let isHovering = $state(false);

	const imageSrc =
		icons[`/src/lib/assets/ingredient-icons/${ingredient.id}.svg`]?.default ?? 'null';

	const getRandomOffset = () => {
		const offsetRange = 10; // adjust this value as needed
		const x = Math.floor(Math.random() * offsetRange * 2 - offsetRange); // -10 to +10
		const y = Math.floor(Math.random() * offsetRange * 2 - offsetRange);
		return `translate(${x}px, ${y}px)`;
	};

	let randomTranslate = getRandomOffset();
</script>

<!-- {#if activeIndex == null || activeIndex == i} -->
<image
	x={coords[0]}
	y={coords[1]}
	href={imageSrc}
	alt={`${ingredient.name} img`}
	class={['h-auto w-2 cursor-pointer lg:w-4', visible ? 'opacity-100' : 'opacity-0']}
	role="presentation"
	onmouseenter={() => {
		isHovering = true;
	}}
	onmouseleave={() => {
		isHovering = false;
	}}
	onclick={() => {
		// activeIndex = i;
		// isHovering = false; [this prevents another ingredient to be clicked while one's info is already open]
	}}
/>
{#if isHovering}
	<HoverTooltip name={ingredient.name} country={ingredient.country.label} {coords} />
{/if}
<!-- {/if} -->
