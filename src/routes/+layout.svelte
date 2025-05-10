<script lang="ts">
	import '$lib/styles/app.css';
	let { children } = $props();
</script>

<section class="content-well flex min-h-screen w-full bg-yellow-100">
	{@render children()}
</section>
