<script lang="ts">
	interface Props {
		label: string;
		state?: 'default' | 'active' | 'hover';
		ariaLabel: string;
		onClickFn: () => void;
	}

	let { label, state, ariaLabel, onClickFn }: Props = $props();
</script>

<button
	class={[
		'heading-2 transition-[bg, border] p-1 leading-[80%] duration-300 ease-linear',
		state == 'default'
			? 'cursor-pointer border-1 border-green-100 bg-transparent text-black'
			: state == 'hover'
				? 'cursor-pointer border-1 border-black bg-green-100 text-white'
				: 'cursor-default border-1 border-black bg-green-100 text-white'
	]}
	onmouseenter={() => {
		if (state != 'active') {
			state = 'hover';
		}
	}}
	onmouseleave={() => {
		if (state == 'hover') {
			state = 'default';
		}
	}}
	onclick={() => {
		state = 'active';
		onClickFn();
	}}
	aria-label={ariaLabel}
>
	{label}
</button>
