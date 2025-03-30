<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		name: string;
		country: string;
	}

	let { name, country }: Props = $props();
</script>

<div
	class="absolute top-0 left-0 z-10 border-1 border-black bg-blue-100 p-1 text-black shadow-lg"
	transition:fade={{ duration: 200 }}
>
	<p class="heading-1">{name}</p>
	<p class="heading-2">{country}</p>
</div>
