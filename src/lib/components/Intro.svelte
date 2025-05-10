<script lang="ts">
	import MyButton from '$lib/components/MyButton.svelte';
	import { scale, slide, fade, fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { goto } from '$app/navigation';

	let active = $state(true);

	const handleButtonClick = () => {
		active = false;
		goto('/experience');
	};
</script>

<div class="flex w-1/2 flex-col items-center justify-center gap-6">
	<div class="flex flex-col items-center">
		<div class="title">Tatva</div>
		<div class="heading-1">The Origins of Ingredients</div>
	</div>
	<div class="body columns-2 gap-x-8 font-sans tracking-normal text-black">
		The story of Tatva begins with the British Empire, unfortunately, as is often the case in modern
		Indian history. In the 1600s, the British, in their relentless pursuit of global expansion,
		developed a deep fondness for Chinese tea. So much so, in fact, that they soon found themselves
		in a trade deficit. Determined to balance the scales, they turned their attention to Assam,
		seizing its fertile lands to cultivate the tea they had come to revere. After a failed attempt
		to steal China’s secrets, however, the British discovered that their newly sourced tea tasted
		dreadful. And to make matters worse, the people of England weren’t interested in drinking it.
		True to their imperial nature, the British launched a 40-year campaign to force this tea onto
		the Indian population.
		<br /><br />
		The tea, still lacking flavor, eventually found its way into the hands of India’s street vendors.
		Somewhere between World War I and the 1930s, these chaiwallahs began adding spices, transforming
		the once-bland brew into something extraordinary. And so, masala chai was born. Today, it remains
		one of India's most cherished traditions: every morning, my parents begin their day with a cup of
		masala chai, just as nearly every household across India does. Chai is woven into the fabric of our
		daily lives and is an integral part of the history of free India, and it was brewed in resistance.
		<br /><br />
		I never really paused to consider the history behind chai in my culture. I simply assumed it had
		always been there. But it made me wonder how many other foods, flavors, and ingredients do I take
		for granted? For example, truffles in Italian cuisine, Sichuan peppercorns in Chinese food, Aleppo
		peppers in Syrian dishes, and za'atar in Mediterranean cooking. These ingredients feel so tied to
		their cultures, as if they’ve always belonged. But each one has its own journey of how it originated,
		how it traveled, and how it came to find a home in new lands. And that’s the essence of Tatva.
	</div>

	<MyButton
		label={'Begin'}
		state={'default'}
		ariaLabel={'button to move to next section'}
		onClickFn={() => {
			handleButtonClick();
		}}
	/>
</div>
