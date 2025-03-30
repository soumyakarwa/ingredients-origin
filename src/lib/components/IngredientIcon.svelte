<script lang="ts">
	import { icons } from '$lib/stores';
	import { tick } from 'svelte';
	import HoverTooltip from '$lib/components/HoverTooltip.svelte';

	interface Props {
		ingredient: {
			id: string;
			name: string;
			country: string;
			text: string;
			[key: string]: any;
		};
		coords: number[];
		// value: 'inactive' | 'hover' | 'active';
		i: number;
		activeIndex: number | null;
	}

	let { ingredient, coords, i, activeIndex = $bindable() }: Props = $props();
	let isHovering = $state(false);

	const imageSrc =
		icons[`/src/lib/assets/ingredient-icons/${ingredient.id}.svg`]?.default ?? 'null';
	// adding a random translate to prevent icons from sitting on top of each other?

	$inspect(isHovering);
</script>

<div class="absolute" style={`left:${coords[0]}px; top:${coords[1]}px`}>
	<img
		src={imageSrc}
		alt={`${ingredient.name} img`}
		class={['h-auto w-2 cursor-pointer lg:w-4']}
		role="presentation"
		onmouseenter={() => {
			isHovering = true;
		}}
		onmouseleave={() => {
			isHovering = false;
		}}
		onclick={() => {
			activeIndex = i;
			isHovering = false;
		}}
	/>
</div>
{#if isHovering}
	<HoverTooltip name={ingredient.name} country={ingredient.country} />
{/if}
