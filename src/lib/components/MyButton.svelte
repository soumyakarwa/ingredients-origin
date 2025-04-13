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
		'heading-2 transition-[bg, border] cursor-pointer p-1 leading-[80%] duration-300 ease-linear',
		state == 'default'
			? 'border-1 border-yellow-100 bg-transparent'
			: state == 'hover'
				? 'border-1 border-black bg-transparent'
				: 'border-1 border-black bg-yellow-100'
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
