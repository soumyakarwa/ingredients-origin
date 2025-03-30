<script lang="ts">
	import { icons } from '$lib/stores';
	import Tooltip from './Tooltip.svelte';

	interface Props {
		ingredient: {
			id: string;
			name: string;
			country: string;
			text: string;
			[key: string]: any;
		};
		coords: number[];
	}

	let { ingredient, coords }: Props = $props();
	let tooltipState = $state<'inactive' | 'hover' | 'active'>('inactive');

	const imageSrc =
		icons[`/src/lib/assets/ingredient-icons/${ingredient.id}.svg`]?.default ?? 'null';
	// adding a random translate to prevent icons from sitting on top of each other?
</script>

<div class="absolute" style={`left:${coords[0]}px; top:${coords[1]}px`}>
	<img
		src={imageSrc}
		alt={`${ingredient.name} img`}
		class={['h-auto w-2 lg:w-4', tooltipState != 'inactive' ? 'cursor-pointer' : 'cursor-default']}
		role="presentation"
		onmouseenter={() => (tooltipState = 'hover')}
		onmouseleave={() => {
			if (tooltipState === 'hover') {
				tooltipState = 'inactive';
			}
		}}
		onclick={() => (tooltipState = 'active')}
	/>
	<Tooltip {ingredient} {tooltipState} />
</div>
