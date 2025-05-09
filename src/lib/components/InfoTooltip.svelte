<script lang="ts">
	import Button from '$lib/components/MyButton.svelte';
	import NumberFlow, { continuous } from '@number-flow/svelte';
	import { fade, slide } from 'svelte/transition';
	import { linear } from 'svelte/easing';
	import { utcYear } from 'd3';

	interface Props {
		ingredient: Ingredient;
		activeIndex: number | null;
		value: 'active' | 'inactive';
	}

	let { ingredient, activeIndex = $bindable(), value = $bindable() }: Props = $props();

	let storyActive = $state(true);
</script>

<div
	class={[
		'flex max-h-full w-full items-start justify-center overflow-y-auto rounded-none border-1 border-black px-3 py-3 shadow-sm transition-all duration-300 ease-linear'
	]}
	transition:fade={{ duration: 300, delay: 100, easing: linear }}
>
	<div class="relative flex w-full flex-col items-start gap-6">
		<button
			class="heading-2 absolute top-0 right-0 cursor-pointer text-black"
			onclick={() => {
				value = 'inactive';
				activeIndex = null;
			}}
			aria-label="Close tooltip"
		>
			X
		</button>
		<!-- <div class="title absolute top-0 right-0 text-green-100">
			<NumberFlow
				plugins={[continuous]}
				value={activeIndex != null ? ingredient.year.label : '2025'}
				format={{ notation: 'standard', useGrouping: false }}
				suffix={activeIndex != null ? ingredient.year.suffix : ''}
			/>
		</div> -->
		<div class="flex w-full flex-col items-start">
			<p class="title">{ingredient.name}</p>
			<p class="heading-1">
				{ingredient.country.label} ~ <NumberFlow
					plugins={[continuous]}
					value={activeIndex != null ? ingredient.year.label : '2025'}
					format={{ notation: 'standard', useGrouping: false }}
					suffix={activeIndex != null ? ingredient.year.suffix : ''}
				/>
			</p>
			<!-- <p class="heading-1"></p> -->
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
				<div class="body columns-2 gap-x-8 font-sans tracking-normal text-black">
					{#each ingredient.text as t}
						{t}<br /><br />
					{/each}
				</div>
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
