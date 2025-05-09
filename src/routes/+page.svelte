<script lang="ts">
	import Globe from '$lib/components/Globe.svelte';
	import Sketch from '$lib/components/Sketch.svelte';

	let ingredientId = $state('');
</script>

<div class="content-well relative flex flex-col items-start">
	<div class="absolute top-0 left-0">
		<Sketch {ingredientId} />
	</div>
	<Globe {ingredientId} />
</div>
