<script>
	import '../../../app.pcss';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import {
		UserSolid,
		UserOutline,
		UsersSolid,
		UsersOutline,
		UsersGroupSolid,
		UsersGroupOutline,
		PieChartSolid,
		ChartOutline,
		BadgeCheckSolid,
		BadgeCheckOutline
	} from 'flowbite-svelte-icons';
	let showSidebar = false;
	const handleSidebar = () => {
		showSidebar = !showSidebar;
	};
	let activeUrl;
	$: activeUrl = $page.url.pathname;
	export let data;
	const { user } = data;
	const handleLogout = () => {
		goto('/logout');
	};
</script>

<svelte:head>
	<title>PKPU</title>
</svelte:head>

<nav
	class="fixed top-0 z-40 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
>
	<div class="px-3 py-3 lg:px-5 lg:pl-3">
		<div class="flex items-center justify-between">
			<div class="flex items-center justify-start rtl:justify-end">
				<button
					on:click={handleSidebar}
					data-drawer-target="logo-sidebar"
					data-drawer-toggle="logo-sidebar"
					aria-controls="logo-sidebar"
					type="button"
					class="inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
				>
					<span class="sr-only">Open sidebar</span>
					<svg
						class="h-6 w-6"
						aria-hidden="true"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							clip-rule="evenodd"
							fill-rule="evenodd"
							d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
						></path>
					</svg>
				</button>
				<a href="https://flowbite.com" class="ms-2 flex md:me-24">
					<span
						class="self-center whitespace-nowrap text-xl font-semibold dark:text-white sm:text-2xl"
						>PKPU</span
					>
				</a>
			</div>
			<div class="flex items-center lg:order-2">
				{#if user}
					<Button color="light"><p>{user.email.slice(0, user.email.indexOf('@'))}</p></Button>
					<Dropdown>
						<div slot="header" class="px-4 py-2">
							<span class="block truncate text-sm font-medium">{user.email}</span>
						</div>
						<DropdownItem on:click={handleLogout}>Logout</DropdownItem>
					</Dropdown>
				{:else}
					<Button href="/login">Login</Button>
				{/if}
			</div>
		</div>
	</div>
</nav>

<aside
	id="logo-sidebar"
	class={`${showSidebar ? 'transform-none' : '-translate-x-full'} fixed left-0 top-0 z-30 h-screen w-64 border-r border-gray-200 bg-white pt-20 transition-transform dark:border-gray-700 dark:bg-gray-800 sm:translate-x-0`}
	aria-label="Sidebar"
	aria-modal="true"
	role="dialog"
	aria-hidden={!showSidebar}
>
	<div class="h-full overflow-y-auto bg-white px-3 pb-4 dark:bg-gray-800">
		<ul class="space-y-2 font-medium">
			<li>
				<a
					href={`/dashboard`}
					class={`${activeUrl === `/dashboard` ? 'bg-gray-100 font-semibold text-gray-900' : 'font-medium'} group flex items-center rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700`}
				>
					{#if activeUrl === `/dashboard`}
						<PieChartSolid size="md" class="" />
					{:else}
						<ChartOutline size="md" class="" />
					{/if}
					<span class="ms-3">Dashboard</span>
				</a>
			</li>
			<li>
				<a
					href={`/kreditor`}
					class={`${activeUrl.startsWith(`/kreditor`) ? 'bg-gray-100 font-semibold text-gray-900' : 'font-medium'} group flex items-center rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700`}
				>
					{#if activeUrl.startsWith(`/kreditor`)}
						<UsersGroupSolid size="md" class="" />
					{:else}
						<UsersGroupOutline size="md" class="" />
					{/if}
					<span class="ms-3 flex-1 whitespace-nowrap">Kreditor</span>
				</a>
			</li>
			<li>
				<a
					href={`/debitor`}
					class={`${activeUrl.startsWith(`/debitor`) ? 'bg-gray-100 font-semibold text-gray-900' : 'font-medium'} group flex items-center rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700`}
				>
					{#if activeUrl.startsWith(`/debitor`)}
						<UsersSolid size="md" class="" />
					{:else}
						<UsersOutline size="md" class="" />
					{/if}
					<span class="ms-3 flex-1 whitespace-nowrap">Debitor</span>
				</a>
			</li>
			{#if data.user.roleId === 1}
				<li>
					<a
						href={`/users`}
						class={`${activeUrl.startsWith(`/users`) ? 'bg-gray-100 font-semibold text-gray-900' : 'font-medium'} group flex items-center rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700`}
					>
						{#if activeUrl.startsWith(`/users`)}
							<UserSolid size="md" class="" />
						{:else}
							<UserOutline size="md" class="" />
						{/if}
						<span class="ms-3 flex-1 whitespace-nowrap">Users</span>
					</a>
				</li>
				<li>
					<a
						href={`/verifypassword`}
						class={`${activeUrl.startsWith(`/verifypassword`) ? 'bg-gray-100 font-semibold text-gray-900' : 'font-medium'} group flex items-center rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700`}
					>
						{#if activeUrl.startsWith(`/verifypassword`)}
							<BadgeCheckSolid size="md" class="" />
						{:else}
							<BadgeCheckOutline size="md" class="" />
						{/if}
						<span class="ms-3 flex-1 whitespace-nowrap">Verify Password</span>
					</a>
				</li>
			{/if}
		</ul>
	</div>
</aside>

<main class="p-4 sm:ml-64">
	<div class="mt-16">
		<slot />
	</div>
</main>
