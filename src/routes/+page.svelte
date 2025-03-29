<script lang="ts">
	import Map from '$lib/components/Map.svelte';
	// import countries from '$lib/data/countries.csv';

	// import { onMount } from 'svelte';

	// let countries: any[] = $state([]);

	// onMount(async () => {
	// 	countries = await csv('/src/lib/data/countries.csv'); // still needs fixing
	// });
</script>

<div class="content-well flex flex-col items-center justify-center">
	<Map />
</div>
