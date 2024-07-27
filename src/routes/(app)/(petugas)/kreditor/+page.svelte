<script>
	import {
		Breadcrumb,
		BreadcrumbItem,
		Dropdown,
		DropdownItem,
	} from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { getContext } from 'svelte';

	const chooseDebitor = getContext('Choose');
	export let data;
	let kreditorData = data.body.kreditorData;

	$: tagihanByDebitor =
		$chooseDebitor === ''
			? kreditorData
			: kreditorData.filter((item) => item.debitorId === $chooseDebitor);

	let toggleDropdown = false; // dropdown toggle
	let currentPage = 1; // default posisi halaman saat ini
	let totalPages = 1; // default total halaman
	$: itemsPerPage = 10; // total item yang akan ditampilkan
	let searchKeyword = ''; // keyword untuk searching
	let paginatedData = [];
	let filteredData = [];
	let searchColumns = ['userEmail', 'nama', 'email', 'noTelp', 'alamat'];

	$: {
		filteredData = tagihanByDebitor.filter((data) => {
			const searchKeywordLower = searchKeyword.toLowerCase();
			return searchColumns.some((column) => {
				const value = data[column];
				if (typeof value === 'string') {
					return value.toLowerCase().includes(searchKeywordLower);
				} else {
					return false;
				}
			});
		});

		totalPages = Math.ceil(filteredData.length / itemsPerPage);

		paginatedData = filteredData.slice(
			(currentPage - 1) * itemsPerPage,
			currentPage * itemsPerPage
		);
	}

	// Fungsi untuk mengubah halaman
	function goToPage(page) {
		currentPage = page;
	}

	function getPagination(currentPage, totalPages) {
		let range = [];
		let dots = '...';

		if (totalPages <= 5) {
			range = Array.from({ length: totalPages }, (_, i) => i + 1);
		} else {
			if (currentPage <= 3) {
				range = [1, 2, 3, dots, totalPages];
			} else if (currentPage >= totalPages - 2) {
				range = [1, dots, totalPages - 2, totalPages - 1, totalPages];
			} else {
				range = [1, dots, currentPage, dots, totalPages];
			}
		}

		return range;
	}

	let itemActiveClass = 'bg-primary-600 hover:bg-primary-800 text-white';

	function changeTotalItems(items) {
		itemsPerPage = items;
		currentPage = 1;
		toggleDropdown = false;
	}
</script>

<div class="space-y-4">
	<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
		<BreadcrumbItem href="/dashboard" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem>List Kreditor</BreadcrumbItem>
	</Breadcrumb>

	<div
		class="border-1 relative overflow-hidden border border-gray-200 bg-white dark:bg-gray-800 sm:rounded-lg"
	>
		<div
			class="flex flex-col items-center justify-between space-y-3 p-4 md:flex-row md:space-x-4 md:space-y-0"
		>
			<div class="w-full md:w-1/2">
				<div class="flex flex-row space-x-3">
					<div>
						<div
							id="items"
							class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-center text-sm font-medium text-gray-900 focus-within:outline-none focus-within:ring-4 focus-within:ring-gray-200 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus-within:ring-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-700"
						>
							<p>{itemsPerPage}</p>
							<ChevronDownOutline class="ms-1 h-5 w-5" />
						</div>
						<Dropdown triggeredBy="#items" bind:open={toggleDropdown}>
							<DropdownItem
								on:click={() => changeTotalItems(10)}
								class={itemsPerPage === 10 && itemActiveClass}>10</DropdownItem
							>
							<DropdownItem
								on:click={() => changeTotalItems(25)}
								class={itemsPerPage === 25 && itemActiveClass}>25</DropdownItem
							>
							<DropdownItem
								on:click={() => changeTotalItems(50)}
								class={itemsPerPage === 50 && itemActiveClass}>50</DropdownItem
							>
						</Dropdown>
					</div>
					<form class="flex w-full items-center">
						<label for="simple-search" class="sr-only">Search</label>
						<div class="relative w-full">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<svg
									aria-hidden="true"
									class="h-5 w-5 text-gray-500 dark:text-gray-400"
									fill="currentColor"
									viewbox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
							<input
								type="text"
								id="search"
								class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
								placeholder="Search"
								bind:value={searchKeyword}
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
				<thead
					class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
				>
					<tr>
						<th scope="col" class="w-10 px-4 py-3">No</th>
						<th scope="col" class="px-4 py-3">User</th>
						<th scope="col" class="px-4 py-3">Nama Kreditor</th>
						<th scope="col" class="px-4 py-3">Email</th>
						<th scope="col" class="px-4 py-3">No Telepon</th>
						<th scope="col" class="px-4 py-3">Alamat</th>
					</tr>
				</thead>
				<tbody>
					{#if paginatedData.length === 0}
						<tr class="border-b dark:border-gray-700">
							<td class="px-4 py-3 text-center" colspan="6">No data found.</td>
						</tr>
					{:else}
						{#each paginatedData as data, index (data)}
							<tr
								class="border-b bg-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
							>
								<td class="px-4 py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
								<td class="px-4 py-3">{data.userEmail}</td>
								<th
									scope="row"
									class="whitespace-nowrap text-wrap px-4 py-3 font-medium text-gray-900 dark:text-white"
									>{data.nama}</th
								>
								<td class="px-4 py-3">{data.email}</td>
								<td class="px-4 py-3 max-w-36">{data.noTelp}</td>
								<td class="px-4 py-3">{data.alamat}</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
		<nav
			class="flex flex-col items-center justify-center space-y-3 p-4 md:flex-row md:justify-between md:space-y-0"
			aria-label="Table navigation"
		>
			<span class="text-sm font-normal text-gray-500 dark:text-gray-400">
				Showing
				<span class="font-semibold text-gray-900 dark:text-white">
					{#if filteredData.length === 0}
						0-0
					{:else}
						{(currentPage - 1) * itemsPerPage + 1}-{Math.min(
							currentPage * itemsPerPage,
							filteredData.length
						)}
					{/if}
				</span>
				of
				<span class="font-semibold text-gray-900 dark:text-white">{filteredData.length}</span>
			</span>
			<ul class="inline-flex items-stretch -space-x-px">
				<li>
					<button
						on:click={() => goToPage(currentPage - 1)}
						disabled={currentPage === 1 || paginatedData.length === 0}
						class={`ml-0 flex h-full items-center justify-center rounded-l-lg border border-gray-300 bg-white px-3 py-1.5 leading-tight ${currentPage === 1 || paginatedData.length === 0 ? 'cursor-not-allowed text-gray-300 hover:bg-white hover:text-gray-300' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'}`}
					>
						<span class="sr-only">Previous</span>
						<svg
							class="h-5 w-5"
							aria-hidden="true"
							fill="currentColor"
							viewbox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</li>
				{#each getPagination(currentPage, totalPages) as page}
					<li>
						{#if page === '...'}
							<span
								class="flex items-center justify-center border border-gray-300 bg-white px-3 py-2 text-sm leading-tight text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
								>...</span
							>
						{:else}
							<button
								on:click={() => goToPage(page)}
								class="flex items-center justify-center border px-3 py-2 text-sm leading-tight {currentPage ===
								page
									? 'border-primary-300 bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
									: 'border-gray-300 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}"
							>
								{page}
							</button>
						{/if}
					</li>
				{/each}
				<li>
					<button
						on:click={() => goToPage(currentPage + 1)}
						disabled={currentPage === totalPages || paginatedData.length === 0}
						class={`ml-0 flex h-full items-center justify-center rounded-r-lg border border-gray-300 bg-white px-3 py-1.5 leading-tight ${currentPage === totalPages || paginatedData.length === 0 ? 'cursor-not-allowed text-gray-300 hover:bg-white hover:text-gray-300' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'}`}
					>
						<span class="sr-only">Next</span>
						<svg
							class="h-5 w-5"
							aria-hidden="true"
							fill="currentColor"
							viewbox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a 1 1 0 010 1.414l-4 4a 1 1 0 01-1.414 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>
				</li>
			</ul>
		</nav>
	</div>
</div>
