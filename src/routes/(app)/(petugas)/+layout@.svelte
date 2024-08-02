<script>
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { setCookie } from '$lib/cookie.js';
	import '../../../app.pcss';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/formatDate.js';
	import { Button, Dropdown, DropdownItem, Radio, Search } from 'flowbite-svelte';
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
		BadgeCheckOutline,
		InboxFullOutline,
		InboxFullSolid
	} from 'flowbite-svelte-icons';
	import Toast from '$lib/components/Toast.svelte';

	let showSidebar = false;
	const handleSidebar = () => {
		showSidebar = !showSidebar;
	};
	let activeUrl;
	$: activeUrl = $page.url.pathname;
	$: {
		$page.url;
		showSidebar = false;
	}
	export let data;
	const { cookieDebitorUid, user, debitorData } = data.body;
	
	// Cek apakah ada uid yang di cookie, kalau ada pakai yg di cookie, kalau di cookie kosong ambil dari login
	let currentDebitorUid = cookieDebitorUid ?? user.debitorUid;
	
	// Cari data debitor berdasarkan currentDebitorUid
	let currentDebitor = debitorData.find((debitor) => debitor.uid === currentDebitorUid);
	
	// Dapatkan id debitor
	let currentDebitorId = currentDebitor ? currentDebitor.id : '';
	
	// Buat writable store untuk menyimpan id debitor yang dipilih
	let selectedDebitorId = writable(currentDebitorId);
	setContext('SelectedDebitor', selectedDebitorId);
	
	// Fungsi untuk memilih debitor dan memperbarui cookie
	const handleDebitorSelection = (id) => {
		selectedDebitorId.set(id);
		let selectedUid = debitorData.find(debitor => debitor.id === id).uid
		setCookie('debitorUid', selectedUid, 1);		
	};
	
	// Inisialisasi variabel untuk menyimpan debitor yang sedang dicentang
	let checkedDebitor = currentDebitorId;

	let searchDebitor = '';
	let tglSidang = '';
	$: filterDebitors = debitorData.filter((debitor) =>
		debitor.nama.toLowerCase().includes(searchDebitor.toLowerCase())
	);
	function checkNama(id) {
		let debitor = debitorData.filter((debitor) => debitor.id === id);
		let nama = debitor[0].nama;
		tglSidang = debitor[0].tglSidang;
		if (nama.length > 20) {
			return nama.slice(0, 20) + '...';
		}
		return nama;
	}
	// ------- End Filter Debitor -------------
	const handleLogout = () => {
		goto('/logout');
	};
	const menuConfig = [
		{
			href: '/dashboard',
			label: 'Dashboard',
			icon: { active: PieChartSolid, inactive: ChartOutline },
			roles: [1, 2, 3]
		},
		{
			href: '/kreditor',
			label: 'Kreditor',
			icon: { active: UsersGroupSolid, inactive: UsersGroupOutline },
			roles: [1, 2, 3]
		},
		{
			href: '/debitor',
			label: 'Debitor',
			icon: { active: UsersSolid, inactive: UsersOutline },
			roles: [1, 2]
		},
		{
			href: '/tagihandetail',
			label: 'Tagihan',
			icon: { active: InboxFullSolid, inactive: InboxFullOutline },
			roles: [1, 2, 3]
		},
		{
			href: '/users',
			label: 'Users',
			icon: { active: UserSolid, inactive: UserOutline },
			roles: [1]
		},
		{
			href: '/verifypassword',
			label: 'Verify Password',
			icon: { active: BadgeCheckSolid, inactive: BadgeCheckOutline },
			roles: [1, 2]
		}
	];

	function getMenuItemsForRole(roleId) {
		return menuConfig.filter((item) => item.roles.includes(roleId));
	}

	let menu = getMenuItemsForRole(user.roleId);

	const roleDescription = user.roleId === 1 ? 'Admin' : user.roleId === 2 ? 'Pengurus' : 'Assisten';
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
					data-drawer-show="logo-sidebar"
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
				<a href="/" class="ms-2 flex md:me-24">
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
						<div class="px-4 py-3">
							<span class="block text-sm font-semibold text-gray-900 dark:text-white"
								>{user.email}</span
							>
							<span class="block truncate text-sm text-gray-900 dark:text-white"
								>{roleDescription}</span
							>
						</div>
						<DropdownItem on:click={handleLogout}>Log out</DropdownItem>
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
	class={`${showSidebar ? 'transform-none' : '-translate-x-full'} fixed left-0 top-0 z-30 h-screen w-64 border-r border-gray-200 bg-white transition-transform dark:border-gray-700 dark:bg-gray-800 sm:translate-x-0`}
	aria-label="Sidebar"
	aria-modal="true"
	tabindex="-1"
	role="dialog"
	aria-hidden={!showSidebar}
>
	<div class="mt-2 h-full overflow-y-auto bg-white px-3 py-[70px] dark:bg-gray-800">
		<ul class="space-y-2 font-medium">
			<li>
				<Button
					color="light"
					class="m-0 flex w-full justify-between border-0 bg-gray-50 px-3 focus:ring-2"
				>
					<div class="flex flex-col text-left">
						<p class="text-base font-medium">
							{$selectedDebitorId == null ? 'Pilih Debitor' : checkNama($selectedDebitorId)}
						</p>
						<p class="text-xs font-extralight text-gray-500">
							Tanggal sidang : {$selectedDebitorId == null ? '' : formatDate(tglSidang)}
						</p>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-4 w-4 text-gray-900"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
						/>
					</svg>
				</Button>
				<Dropdown placement="bottom" class="max-h-44 min-h-5 w-full overflow-y-auto px-3 pb-3 text-sm">
					<div slot="header" class="p-3">
						<Search size="md" bind:value={searchDebitor} />
					</div>
					{#each filterDebitors as { id, nama }}
						<li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
							<Radio
								value={id}
								bind:group={checkedDebitor}
								on:change={() => handleDebitorSelection(id)}
								name="debitor">{nama}</Radio
							>
						</li>
					{/each}
				</Dropdown>
			</li>
			{#each menu as item}
				<li>
					<a
						href={item.href}
						class={`${activeUrl.startsWith(item.href) ? 'bg-gray-100 font-semibold text-gray-900' : 'font-medium'} group flex items-center rounded-lg p-2 text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-700`}
					>
						{#if activeUrl.startsWith(item.href)}
							<svelte:component this={item.icon.active} size="md" class="" />
						{:else}
							<svelte:component this={item.icon.inactive} size="md" class="" />
						{/if}
						<span class="ms-3 flex-1 whitespace-nowrap">{item.label}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</aside>
{#if showSidebar}
	<button
		on:click={handleSidebar}
		type="button"
		class="fixed inset-0 z-20 bg-gray-900/50 dark:bg-gray-900/80"
	/>
	<!-- <div drawer-backdrop="" class="fixed inset-0 z-20 bg-gray-900/50 dark:bg-gray-900/80" /> -->
{/if}
<main class="p-4 sm:ml-64">
	<div class="mt-16">
		<Toast />
		<slot />
	</div>
</main>
