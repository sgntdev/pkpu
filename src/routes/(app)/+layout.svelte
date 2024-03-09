<script>
	import '../../app.pcss';
	import { page } from '$app/stores';
	export let data;
	const { user } = data;
</script>

<svelte:head>
	<title>PKPU</title>
</svelte:head>
<nav
	data-sveltekit-reload
	class="relative top-0 z-50 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
>
	<div class="px-3 py-3 lg:px-5 lg:pl-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center justify-start rtl:justify-end">
				<a href="https://flowbite.com" class="ms-2 flex md:me-24">
					<span
						class="self-center whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl"
						>PKPU</span
					>
				</a>
			</div>
			<div class="flex items-center lg:order-2">
				<p class="text-sm text-gray-500 dark:text-white">{user ?? $page.state.user ?? ''}</p>
			</div>
		</div>
	</div>
</nav>
<main class="p-4">
	<slot />
</main>
