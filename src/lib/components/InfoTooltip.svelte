<script lang="ts">
	import Button from '$lib/components/MyButton.svelte';
	import { fade, slide } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	interface Props {
		ingredient: Ingredient;
		activeIndex: number | null;
		value: 'active' | 'inactive';
	}

	let { ingredient, activeIndex = $bindable(), value = $bindable() }: Props = $props();

	let storyActive = $state(true);
</script>

<!-- style={`left:${coords[0]}px; top:${coords[1]}px;`} -->
<div
	class={[
		'glass-bg flex h-full w-sm items-start justify-center overflow-y-auto rounded-none border-1 border-yellow-100 bg-blue-100 px-3 py-3 transition-all duration-300 ease-linear'
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
				<div class="grid w-full grid-cols-1 lg:grid-cols-2">
					<div class="body flex w-[70%] flex-col gap-0.5 p-1">
						<p class="w-full self-center uppercase">Aleppo Sweets</p>
						<div class="flex w-full flex-row justify-between">
							<p>⭐</p>
							<p>9.0/10.0</p>
						</div>
						<div class="flex w-full flex-row justify-between">
							<p>🍝</p>
							<p>Dish Name</p>
						</div>
						<div class="flex w-full flex-row justify-between">
							<p>📍</p>
							<p>Location</p>
						</div>
					</div>
					<div class="body flex w-[70%] flex-col gap-0.5 p-1">
						<p class="uppercase">Aleppo Sweets</p>
						<div class="flex w-full flex-row justify-between">
							<p>⭐</p>
							<p>9.0/10.0</p>
						</div>
						<div class="flex w-full flex-row justify-between">
							<p>🍝</p>
							<p>Dish Name</p>
						</div>
						<div class="flex w-full flex-row justify-between">
							<p>📍</p>
							<p>Location</p>
						</div>
					</div>
				</div>
				<p class="body font-sans tracking-normal text-black">
					THIS IS A TEXT PLACEHOLDER WITH THE SAME WIDTH
				</p>
			{/if}
		</div>
	</div>
</div>
