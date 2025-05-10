<script lang="ts">
	import Globe from '$lib/components/Globe.svelte';
	import Sketch from '$lib/components/Sketch.svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { onMount, tick } from 'svelte';

	let ingredientId = $state('');
	let mounted = $state(false);

	onMount(async () => {
		await tick();
		mounted = true;
	});
</script>

{#if mounted}
	<div
		in:fly={{ y: 500, duration: 300, opacity: 100, easing: cubicInOut }}
		out:fly={{ y: -500, duration: 300, opacity: 0, easing: cubicInOut }}
		class="h-full w-full"
	>
		{#if ingredientId !== ''}
			{#key ingredientId}
				<div class="absolute top-0 left-0">
					<Sketch {ingredientId} />
				</div>
			{/key}
		{/if}
		<Globe bind:ingredientId />
	</div>
{/if}
