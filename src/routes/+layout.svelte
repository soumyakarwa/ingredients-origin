<script lang="ts">
	import '$lib/styles/app.css';
	let { children } = $props();
</script>

<section class="flex min-h-screen w-full bg-blue-100">
	{@render children()}
</section>
