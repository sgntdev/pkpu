<script>
    import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	injectSpeedInsights();
    import '../../../app.pcss';
</script>
<svelte:head>
	<title>PKPU</title>
</svelte:head>
<main class="min-h-screen flex flex-col justify-center items-center">
    <slot/>
</main>