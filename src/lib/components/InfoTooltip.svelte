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
</script>

<div
	class={[
		'relative z-10 flex max-h-full w-full items-start justify-center overflow-y-auto rounded-none border-1 border-black bg-yellow-100 px-3 py-3 shadow-sm'
	]}
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
				<div class="title">Tatva</div>
				<div class="heading-1">The Origins of Ingredients</div>
			</div>
			<div class="body columns-2 gap-x-8 font-sans tracking-normal text-black">
				The story of Tatva begins with the British Empire, unfortunately, as is often the case in
				modern Indian history. In the 1600s, the British, in their relentless pursuit of global
				expansion, developed a deep fondness for Chinese tea. So much so, in fact, that they soon
				found themselves in a trade deficit. Determined to balance the scales, they turned their
				attention to Assam, seizing its fertile lands to cultivate the tea they had come to revere.
				After a failed attempt to steal China’s secrets, however, the British discovered that their
				newly sourced tea tasted dreadful. And to make matters worse, the people of England weren’t
				interested in drinking it. True to their imperial nature, the British launched a 40-year
				campaign to force this tea onto the Indian population.
				<br /><br />
				The tea, still lacking flavor, eventually found its way into the hands of India’s street vendors.
				Somewhere between World War I and the 1930s, these chaiwallahs began adding spices, transforming
				the once-bland brew into something extraordinary. And so, masala chai was born. Today, it remains
				one of India's most cherished traditions: every morning, my parents begin their day with a cup
				of masala chai, just as nearly every household across India does. Chai is woven into the fabric
				of our daily lives and is an integral part of the history of free India, and it was brewed in
				resistance.
				<br /><br />
				I never really paused to consider the history behind chai in my culture. I simply assumed it
				had always been there. But it made me wonder how many other foods, flavors, and ingredients do
				I take for granted? For example, truffles in Italian cuisine, Sichuan peppercorns in Chinese
				food, Aleppo peppers in Syrian dishes, and za'atar in Mediterranean cooking. These ingredients
				feel so tied to their cultures, as if they’ve always belonged. But each one has its own journey
				of how it originated, how it traveled, and how it came to find a home in new lands. And that’s
				the essence of Tatva.
			</div>
		</div>
	{:else}
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
	{/if}
</div>
