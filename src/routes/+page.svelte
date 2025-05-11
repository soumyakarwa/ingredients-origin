<script lang="ts">
	import Intro from '$lib/components/Intro.svelte';
	import Sketch from '$lib/components/Sketch.svelte';
	import { scale, fade, fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { onMount, tick } from 'svelte';

	let mounted = $state(false);
	const ingredients = [
		'aleppo-pepper',
		'bell-pepper',
		'bok-choy',
		'truffle',
		'potato',
		'avocado',
		'walnut',
		'carrot',
		'cilantro'
	];
	const bezier = {
		startPos: { x: 0.7, y: 0 },
		endPos: { x: 1, y: 0.5 },
		control1: { x: -0.5, y: 0.2 },
		control2: { x: 0.3, y: 1.5 }
	};

	onMount(async () => {
		await tick();
		mounted = true;
	});
</script>

{#if mounted}
	<div
		in:fly={{ y: 500, duration: 300, opacity: 100, easing: cubicInOut }}
		out:fly={{ y: -500, duration: 300, opacity: 0, easing: cubicInOut }}
		class="margin-auto flex items-center justify-center"
	>
		<div class="pointer-events-none absolute top-0 left-0">
			<Sketch ingredientId={ingredients} {bezier} />
		</div>
		<Intro />
	</div>
{/if}
