<script lang="ts">
	import { fade } from 'svelte/transition';
	import { linear } from 'svelte/easing';

	interface Props {
		name: string;
		country: string;
		coords: number[];
	}

	let { name, country, coords }: Props = $props();
</script>

<div
	style={`left:${coords[0]}px; top:${coords[1]}px;`}
	class="absolute z-10 translate-x-1/5 translate-y-1/5 border-1 border-black bg-blue-100 p-1 text-black shadow-lg"
	transition:fade={{ duration: 200, easing: linear }}
>
	<p class="heading-1">{name}</p>
	<p class="heading-2">{country}</p>
</div>
