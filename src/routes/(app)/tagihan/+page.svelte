<script>
	import {
		Modal,
		Breadcrumb,
		BreadcrumbItem,
		Badge,
		Indicator,
		Spinner,
		Button,
		Dropdown,
		DropdownItem
	} from 'flowbite-svelte';
	export let data;
	import { ExclamationCircleOutline, ChevronDownOutline } from 'flowbite-svelte-icons';
	import { showToast } from '$lib/toastStore';
	const { user, debitor, token } = data?.body;
	$: tagihan = data.body.tagihan;
	let deleteModal = false;
	let deleteTargetId;
	let loading = false;
	const openDeleteModal = (id) => {
		deleteTargetId = id;
		deleteModal = true;
	};
	const handleDeleteTagihan = async () => {
		loading = true
		try {
			const response = await fetch(`/api/tagihan/${deleteTargetId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const result = await response.json();
			if (result.success) {
				showToast(result.message, 'success');
				const updateDataRes = await fetch(`/api/debitor/${debitor.id}/tagihan?userId=${user.id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const updatedData = await updateDataRes.json();
				tagihan = updatedData.data;
			} else {
				showToast(result.message, 'error');
			}
		} catch (error) {
			console.error(error);
		} finally {
			deleteTargetId = null;
			deleteModal = false;
			loading = false
		}
	};
	const formatPrice = (price) => {
		if (typeof price !== 'string') {
			price = price?.toString();
		}
		const digits = price.replace(/,/g, '');
		const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return formatted;
	};
	let toggleDropdown = false; // dropdown toggle
	let currentPage = 1; // default posisi halaman saat ini
	let totalPages = 1; // default total halaman
	$: itemsPerPage = 10; // total item yang akan ditampilkan
	let searchKeyword = ''; // keyword untuk searching
	let filterStatus = [0, 1, 2];
	let paginatedData = [];
	let filteredData = [];
	let searchColumns = ['namaKreditor'];
	function toggleFilterStatus(status) {
		if (status === 'all') {
			filterStatus = [0, 1, 2];
		} else if (filterStatus.includes(status)) {
			filterStatus = filterStatus.filter((s) => s === status);
		} else {
			filterStatus = [status];
		}
	}
	$: {
		filteredData = tagihan.filter((data) => {
			const searchKeywordLower = searchKeyword.toLowerCase();
			return (
				searchColumns.some((column) => {
					const value = data[column];
					if (typeof value === 'string') {
						return value.toLowerCase().includes(searchKeywordLower);
					} else {
						return false;
					}
				}) && filterStatus.includes(data.status)
			);
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

<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
	<BreadcrumbItem href="/" home>List Tagihan</BreadcrumbItem>
</Breadcrumb>

<div
	class="border-1 relative overflow-hidden border border-gray-200 bg-white dark:bg-gray-800 sm:rounded-lg"
>
	<div class="border-b-[1px] border-gray-200 p-4">
		<h5 class="mb-2 text-left text-lg font-medium text-gray-900 dark:bg-gray-800 dark:text-white">
			List Tagihan <span class="font-semibold">{debitor.nama}</span>
		</h5>
		<div
			class="flex flex-col items-center justify-between space-y-3 md:flex-row md:space-x-4 md:space-y-0"
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
			<div
				class="flex w-full flex-shrink-0 flex-col items-stretch justify-end space-y-2 md:w-auto md:flex-row md:items-center md:space-x-3 md:space-y-0"
			>
				<Button href="tagihan/create">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="mr-2 h-3.5 w-3.5"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
					</svg>

					Tambah tagihan</Button
				>
			</div>
		</div>
	</div>
	<div class="flex w-full p-4">
		<label for="inline-radio" class="me-4 text-sm font-medium text-gray-900 dark:text-gray-300"
			>Show only:</label
		>
		<div class="me-4 flex items-center">
			<input
				checked
				id="inline-radio"
				type="radio"
				name="inline-radio-group"
				on:change={() => toggleFilterStatus('all')}
				class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
			/>
			<label for="inline-radio" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
				>All</label
			>
		</div>
		<div class="me-4 flex items-center">
			<input
				id="inline-2-radio"
				type="radio"
				name="inline-radio-group"
				on:change={() => toggleFilterStatus(1)}
				class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
			/>
			<label for="inline-2-radio" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
				>Verified</label
			>
		</div>
		<div class="me-4 flex items-center">
			<input
				id="inline-checked-radio"
				type="radio"
				name="inline-radio-group"
				on:change={() => toggleFilterStatus(2)}
				class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
			/>
			<label
				for="inline-checked-radio"
				class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Objection</label
			>
		</div>
		<div class="me-4 flex items-center">
			<input
				id="inline-checked-radio"
				type="radio"
				name="inline-radio-group"
				on:change={() => toggleFilterStatus(0)}
				class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
			/>
			<label
				for="inline-checked-radio"
				class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Pending</label
			>
		</div>
	</div>
	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
			<thead class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
				<tr>
					<th scope="col" class="w-10 px-4 py-3">No</th>
					<th scope="col" class="min-w-48 px-4 py-3">Kreditor</th>
					<th scope="col" class="px-4 py-3">Pertanggal</th>
					<th scope="col" class="px-4 py-3">Total Tagihan</th>
					<th scope="col" class="px-4 py-3">Golongan</th>
					<th scope="col" class="w-10 px-4 py-3">Jumlah Tagihan Seluruhnya</th>
					<th scope="col" class="px-4 py-3">Mulai Terunggak</th>
					<th scope="col" class="px-4 py-3">Status</th>
					<th scope="col" class="px-4 py-3">Aksi</th>
				</tr>
			</thead>
			<tbody>
				{#if loading}
					<tr class="border-b dark:border-gray-700">
						<td class="px-4 py-3 text-center" colspan="9"> <Spinner color="blue" size={8} /></td>
					</tr>
				{:else if paginatedData.length === 0}
					<tr class="border-b dark:border-gray-700">
						<td class="px-4 py-3 text-center" colspan="9">No data found.</td>
					</tr>
				{:else}
					{#each paginatedData as data, index (data)}
						<tr
							class="border-b bg-white dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
						>
							<td class="px-4 py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
							<th
								scope="row"
								class="whitespace-nowrap text-wrap px-4 py-3 font-medium text-gray-900 dark:text-white"
								>{data.namaKreditor}</th
							>
							<td class="px-4 py-3">{data.pertanggal}</td>
							<td class="max-w-36 px-4 py-3"
								>Rp. {formatPrice(
									parseFloat(data.denda) + parseFloat(data.hutangPokok) + parseFloat(data.bunga)
								)}</td
							>
							<td class="px-4 py-3">{data.sifatTagihan}</td>
							<td class="px-4 py-3">{data.jumlahTagihan}</td>
							<td class="px-4 py-3">{data.mulaiTertunggak}</td>
							<td class="px-4 py-3"
								>{#if data.status === 0}
									<Badge color="gray" rounded class="px-2.5 py-0.5">
										<Indicator color="dark" size="xs" class="me-1" />Pending
									</Badge>
								{:else if data.status === 1}
									<Badge color="green" rounded class="px-2.5 py-0.5">
										<Indicator color="green" size="xs" class="me-1" />Verified
									</Badge>
								{:else}
									<Badge color="red" rounded class="px-2.5 py-0.5">
										<Indicator color="red" size="xs" class="me-1" />Objection
									</Badge>
								{/if}</td
							>
							<td class="px-4 py-3">
								<div class="inline-flex rounded-md shadow-sm" role="group">
									<a
										href={`/tagihan/${data.id}`}
										class="inline-flex items-center rounded-s-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="me-2 h-3 w-3"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
											/>
										</svg>
										Preview
									</a>
									<a
										href={`/tagihan/edit/${data.id}`}
										class="inline-flex items-center border-b border-t border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:ring-2 focus:ring-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="currentColor"
											class="me-2 h-3 w-3"
										>
											<path
												d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"
											/>
											<path
												d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"
											/>
										</svg>
										Edit
									</a>
									<button
										type="button"
										class="inline-flex items-center rounded-e-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
										on:click={() => openDeleteModal(data.id)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="currentColor"
											class="me-2 h-3 w-3"
										>
											<path
												fillRule="evenodd"
												d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
												clipRule="evenodd"
											/>
										</svg>
										Hapus
									</button>
								</div>
							</td>
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
<!-- delete modal -->
<Modal bind:open={deleteModal} size="xs" autoclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Anda yakin akan menghapus tagihan ini?
		</h3>
		<Button color="red" class="me-2" on:click={handleDeleteTagihan}>Ya, Saya yakin</Button>
		<Button color="alternative">Tidak, batal</Button>
	</div>
</Modal>
