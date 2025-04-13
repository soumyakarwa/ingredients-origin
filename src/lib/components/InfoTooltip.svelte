<script lang="ts">
	import Button from '$lib/components/MyButton.svelte';
	import { fade, slide } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	interface Props {
		ingredient: Ingredient;
		activeIndex: number | null;
		value: 'active' | 'inactive';
		coords: [number, number];
	}

	let { ingredient, coords, activeIndex = $bindable(), value = $bindable() }: Props = $props();

	let storyActive = $state(true);
</script>

<!-- style={`left:${coords[0]}px; top:${coords[1]}px;`} -->
<div
	class={[
		'glass-bg absolute top-0 flex max-h-[80%] w-sm items-start justify-center overflow-y-auto rounded-none border-1 border-yellow-100 px-3 py-3 transition-all duration-300 ease-linear',
		coords[0] < window.innerWidth / 2 ? 'right-0' : 'left-0'
	]}
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
		<div class="flex w-full flex-row items-center gap-4">
			<Button
				label={'ORIGIN'}
				state={storyActive ? 'active' : 'default'}
				onClickFn={() => (storyActive = true)}
				ariaLabel={'Show Origin Story'}
			/>
			<Button
				label={'MY EXPERIENCES'}
				state={storyActive ? 'default' : 'active'}
				onClickFn={() => (storyActive = false)}
				ariaLabel={'Show My Experiences'}
			/>
		</div>
		<div class="flex flex-col gap-3">
			{#if storyActive}
				{#each ingredient.text as t}
					<p class="body font-sans tracking-normal text-black">{t}</p>
				{/each}
			{:else}
				<p class="body font-sans tracking-normal text-black">
					THIS IS A TEXT PLACEHOLDER WITH THE SAME WIDTH
				</p>
			{/if}
		</div>
	</div>
</div>
