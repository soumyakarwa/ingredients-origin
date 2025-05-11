<script lang="ts">
	import Button from '$lib/components/MyButton.svelte';
	import NumberFlow, { continuous } from '@number-flow/svelte';
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	interface Props {
		ingredient: Ingredient;
		activeIndex: number | null;
		value: 'active' | 'inactive';
	}

	let { ingredient, activeIndex = $bindable(), value = $bindable() }: Props = $props();

	let storyActive = $state(true);
	let containerHeight = $state(0);
	let titleHeight = $state(0);

	let colHeight = $derived(containerHeight - titleHeight);
</script>

<div
	class={[
		'border-back relative z-10 flex h-full w-full items-start justify-center rounded-none border-1 bg-yellow-100 px-3 py-3 shadow-sm'
	]}
	bind:clientHeight={containerHeight}
	transition:fade={{ duration: 300, delay: 100, easing: linear }}
>
	{#if activeIndex == null}
		<div
			class={[
				'flex w-full flex-col justify-start gap-6 transition-all duration-300 ease-linear',
				activeIndex == null ? 'opacity-100' : 'opacity-0'
			]}
		>
			<div class="flex flex-col">
				<div class="title">[INGREDIENT]</div>
				<div class="heading-1">Choose An Ingredient</div>
			</div>
			<div class="body columns-2 gap-x-8 font-sans tracking-normal text-black">
				Choose an Ingredient
			</div>
		</div>
	{:else}
		<div class="flex h-full w-full flex-col items-start gap-6">
			<!-- <button
				class="heading-2 absolute top-0 right-0 cursor-pointer text-black"
				onclick={() => {
					value = 'inactive';
					activeIndex = null;
				}}
				aria-label="Close tooltip"
			>
				X
			</button> -->
			<div class="h-max-content flex w-full flex-col items-start" bind:clientHeight={titleHeight}>
				<p class="title">{ingredient.name}</p>
				<p class="heading-1">
					{ingredient.country.label} ~ <NumberFlow
						plugins={[continuous]}
						value={activeIndex != null ? ingredient.year.label : '2025'}
						format={{ notation: 'standard', useGrouping: false }}
						suffix={activeIndex != null ? ingredient.year.suffix : ''}
					/>
				</p>
			</div>
			<!-- <div class="h-max-content flex w-full flex-row items-center gap-4"> -->
			<!-- <Button
				label={'ORIGIN'}
				state={storyActive ? 'active' : 'default'}
				onClickFn={() => (storyActive = true)}
				ariaLabel={'Show Origin Story'}
			/> -->
			<!-- <Button
					label={'MY EXPERIENCES'}
					state={storyActive ? 'default' : 'active'}
					onClickFn={() => (storyActive = false)}
					ariaLabel={'Show My Experiences'}
				/> -->
			<!-- </div> -->
			<!-- {#if storyActive} -->
			<div
				class="body columns-2 gap-x-8 font-sans tracking-normal text-black"
				style:column-fill="auto"
				style:height={`${colHeight - 40}px`}
			>
				{#each ingredient.text as t}
					{t}<br /><br />
				{/each}
			</div>
			<!-- {:else}
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
			{/if} -->
		</div>
	{/if}
</div>
