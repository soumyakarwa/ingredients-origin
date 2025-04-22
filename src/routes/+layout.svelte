<script lang="ts">
	import '$lib/styles/app.css';
	let { children } = $props();
</script>

<section class="flex min-h-screen w-full">
	{@render children()}
</section>
