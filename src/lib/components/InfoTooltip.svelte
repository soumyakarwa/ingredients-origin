<script lang="ts">
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	interface Props {
		ingredient: {
			name: string;
			country: string;
			text: string;
		};
		activeIndex: number | null;
		value: 'active' | 'inactive';
	}

	let { ingredient, activeIndex = $bindable(), value = $bindable() }: Props = $props();
</script>

<div
	class="absolute top-0 left-0 flex max-w-sm items-center justify-center border-1 border-black bg-white px-3 py-3 shadow-xl"
	transition:fade={{ duration: 300, delay: 100, easing: linear }}
>
	<div class="flex w-full flex-col items-start gap-2">
		<div class="flex w-full flex-col items-start">
			<div class="flex w-full flex-row items-center justify-between">
				<p class="heading-1">{ingredient.name}</p>
				<button
					class="heading-1 cursor-pointer text-blue-100"
					onclick={() => {
						value = 'inactive';
						activeIndex = null;
					}}
					aria-label="Close tooltip"
				>
					X
				</button>
			</div>
			<p class="heading-2">{ingredient.country}</p>
		</div>
		<div class="flex flex-col">
			<p class="heading-2">ORIGIN</p>
			<p class="body text-black">{ingredient.text}</p>
		</div>
		<div class="flex flex-col">
			<p class="heading-2">MY EXPERIENCES</p>
			<p class="body text-black">txt placeholder</p>
		</div>
	</div>
</div>
