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

<foreignObject x={coords[0]} y={coords[1]} width="100" height="50">
	<!-- style={`left:${coords[0]}px; top:${coords[1]}px;`} -->
	<div
		class="glass-bg absolute z-10 translate-x-1/5 translate-y-1/5 rounded-none border-1 border-blue-100 px-1 pt-1 pb-2 text-black shadow-lg"
		transition:fade={{ duration: 200, easing: linear }}
	>
		<p class="heading-2 font-semibold">{name}</p>
		<p class="body leading-[80%] uppercase">{country}</p>
	</div>
</foreignObject>
