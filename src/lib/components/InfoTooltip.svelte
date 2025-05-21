<script lang="ts">
	import Button from '$lib/components/MyButton.svelte';
	import restaurants from '$lib/data/restaurants.json';
	import rankings from '$lib/data/visitedBusinessesRanking.json';
	import profiles from '$lib/data/businessProfiles.json';
	import NumberFlow, { continuous } from '@number-flow/svelte';
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	interface Props {
		ingredient: Ingredient;
		activeIndex: number | null;
		value: 'active' | 'inactive';
	}

	interface RestInfo {
		name: string;
		dishName: string;
		ranking: string;
		location: string | null;
	}

	let { ingredient, activeIndex = $bindable(), value = $bindable() }: Props = $props();

	let storyActive = $state(true);
	let colHeight = $state(0);

	let selectedRestaurants = $derived(
		activeIndex != null
			? restaurants.filter((d) => d.country?.includes(ingredient.country.label))
			: null
	);

	let restaurantInformation: RestInfo[] = $state([]);

	$effect(() => {
		let currentInfo: RestInfo[] = [];
		selectedRestaurants?.forEach((s) => {
			const ranking = rankings.filter((d) => d.businessId == s.businessId)[0];
			const business = profiles.filter((d) => d.businessId == s.businessId)[0];

			currentInfo.push({
				name: s.name,
				dishName: s.dish,
				ranking: `${ranking.score.toFixed(1)} / 10.0`,
				location: business.city
			});
		});

		restaurantInformation = currentInfo;
	});
</script>

<div
	class={[
		'border-back relative z-10 flex h-full w-full items-start justify-center rounded-none border-1 bg-yellow-100 px-3 py-3 shadow-sm'
	]}
	transition:fade={{ duration: 300, delay: 100, easing: linear }}
>
	{#if activeIndex == null}
		<div
			class={[
				'flex h-full w-full flex-col justify-start gap-6 overflow-hidden transition-all duration-300 ease-linear',
				activeIndex == null ? 'opacity-100' : 'opacity-0'
			]}
		>
			<div class="flex flex-col">
				<div class="title">Tatva</div>
				<div class="heading-1">Choose An Ingredient</div>
			</div>
			<div class="body flex-1 overflow-y-auto font-sans tracking-normal text-black">
				If we look back in history, there are many moments we could point to and say, “Ah, yes, this
				is why it happened.” For instance, the immediate cause of the First World War was the
				assassination of Archduke Franz Ferdinand, heir to the Austro-Hungarian throne. Of course,
				there were prior years of tension, bloodshed, and political espionage between the nation
				states, yet we point to this event and say, “This is where it all unravelled.” Similarly, I
				believe that the food of a cuisine, and by inference ingredients, has a story behind it– a
				reason for it to one day become inseparable and institutionalized in a people’s history.<br
				/><br />
				I believe an ingredient would only be accepted in a culture because it can take on a role or
				fill a void. For instance, when tomatoes arrived, spaghetti became an integral cultural piece
				in Italy. Originally from across the Atlantic, the tomato was rejected in other parts of Europe
				and North America but readily accepted in Italy. Why? What was it about the sour fruit and about
				Italy at that time that made the ingredient and the culture click together? What other secrets
				lie hidden in the intertwined history of food and culture?
				<br /><br />
				So, I’ve created this website to explore the origins of ingredients. Each ingredient I've chosen
				is through the lens of my dining experiences since moving to the U.S. Click on an ingredient
				to learn more about its story!
			</div>
		</div>
	{:else}
		<div class="flex h-full w-full flex-col items-start gap-6">
			<div class="h-max-content flex w-full flex-col gap-3">
				<div class="flex flex-col">
					<p class="title">{ingredient.name}</p>
					{#if ingredient.year.label != ''}
						<p class="heading-1">
							{ingredient.country.label} ~ <NumberFlow
								plugins={[continuous]}
								value={activeIndex != null ? ingredient.year.label : '2025'}
								format={{ notation: 'standard', useGrouping: false }}
								suffix={activeIndex != null ? ingredient.year.suffix : ''}
							/>
						</p>
					{:else}
						<p class="heading-1">{ingredient.country.label} ~ YEAR UNKNOWN</p>
					{/if}
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
			</div>
			<div class="flex min-h-0 flex-1 flex-col" bind:clientHeight={colHeight}>
				{#if storyActive}
					<div
						class="body columns-2 gap-x-8 font-sans tracking-normal text-black"
						style:column-fill="auto"
						style:height={`${colHeight}px`}
					>
						{#each ingredient.text as t}
							{t}<br /><br />
						{/each}
					</div>
				{:else}
					<div class="grid w-full grid-cols-1 gap-y-4 lg:grid-cols-3">
						{#each restaurantInformation as rest, i}
							<div class="body flex-grow flex-col gap-0.5 p-2">
								<p class="w-full self-center uppercase">{rest.name}</p>
								<div class="flex w-full flex-row justify-between">
									<p>⭐</p>
									<p>{rest.ranking}</p>
								</div>
								<div class="flex w-full flex-row justify-between">
									<p>🍝</p>
									<p>{rest.dishName}</p>
								</div>
								<div class="flex w-full flex-row justify-between">
									<p>📍</p>
									<p>{rest.location}</p>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
