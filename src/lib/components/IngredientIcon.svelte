<script lang="ts">
	import { getRandomOffset } from '$lib/components/utils/getRandomOffset';

	interface Props {
		x: number;
		y: number;
		visible: boolean;
		isActive: boolean;
		name: string;
		id: string;
		onClickFn: () => void;
	}

	let { x, y, visible, isActive, name, id, onClickFn }: Props = $props();
</script>

<image
	{x}
	{y}
	href={`/icons/${id}.png`}
	transform={getRandomOffset()}
	class={[
		'h-auto origin-center cursor-pointer stroke-black stroke-1 transition-[width] duration-300 ease-linear',
		'drop-shadow-[0_0_0_2px_black]',
		visible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
		isActive ? 'w-5 lg:w-20' : 'w-2 lg:w-8'
	]}
	role="presentation"
	aria-describedby={`${name} img`}
	onerror={(e) => {
		const img = e.target as SVGImageElement;
		img.setAttribute('href', '/icons/asafoetida.png');
	}}
	onclick={() => onClickFn()}
/>
