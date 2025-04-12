<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	interface Props {
		ingredient: Ingredient;
		activeIndex: number | null;
		value: 'active' | 'inactive';
		coords: [number, number];
	}

	let { ingredient, coords, activeIndex = $bindable(), value = $bindable() }: Props = $props();
</script>

<!-- style={`left:${coords[0]}px; top:${coords[1]}px;`} -->
<div
	class="glass-bg absolute top-0 left-0 flex max-h-[90%] max-w-sm items-start justify-center overflow-y-auto rounded-xs border-1 border-yellow-100 px-3 py-3 transition-all duration-300 ease-linear"
	transition:fade={{ duration: 300, delay: 100, easing: linear }}
>
	<div class="relative flex w-full flex-col items-start gap-6">
		<button
			class="heading-2 absolute top-0 right-0 cursor-pointer text-yellow-100"
			onclick={() => {
				value = 'inactive';
				activeIndex = null;
			}}
			aria-label="Close tooltip"
		>
			X
		</button>
		<div class="flex w-full flex-col items-start">
			<p class="heading-1">{ingredient.name}</p>
			<p class="heading-2 leading-[80%]">{ingredient.country.label}</p>
		</div>
		<div class="flex flex-col gap-3">
			<!-- <p class="heading-2">ORIGIN</p> -->
			{#each ingredient.text as t}
				<p class="body font-sans tracking-normal text-black">{t}</p>
			{/each}
		</div>
		<!-- <div class="flex flex-col"> -->
		<!-- <p class="heading-2">MY EXPERIENCES</p> -->
		<p class="body font-sans tracking-normal text-black">txt placeholder</p>
		<!-- </div> -->
	</div>
</div>
