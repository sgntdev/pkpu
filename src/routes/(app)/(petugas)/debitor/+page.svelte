<script>
	import DatePicker from '$lib/components/DatePicker.svelte';
	import { showToast } from '$lib/toastStore';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Modal,
		Spinner,
		Dropdown,
		DropdownItem
	} from 'flowbite-svelte';
	import { format } from 'date-fns';
	import MultiSelect from 'svelte-multiselect';
	import { ExclamationCircleOutline, ChevronDownOutline } from 'flowbite-svelte-icons';
	export let data;
	const { token, roleId, pengurus } = data.body;
	let debitor = data.body.debitor;
	let selectedPengurus;
	let createModal = false;
	let editModal = false;
	let deleteModal = false;
	let editTargetId;
	let deleteTargetId;
	let form;
	let loading = false;

	const listPengurus =
		pengurus &&
		pengurus.map((item) => ({
			label: item.email,
			value: item.id
		}));
	let dataDebitor = {
		nama: '',
		tglSidang: '',
		tempatSidang: '',
		pengurus: []
	};

	const formatDate = (date) => (date ? format(new Date(date), 'dd MMMM yyyy') : '');

	$: dataDebitor.tglSidang = formatDate(dataDebitor.tglSidang);

	const openCreateModal = () => {
		createModal = true;
	};

	const openEditModal = (id, nama, tglSidang, tempatSidang, pengurusAccess) => {
		selectedPengurus = listPengurus.filter((pengurus) => pengurusAccess.includes(pengurus.value));
		editTargetId = id;
		editModal = true;
		dataDebitor = {
			nama,
			tglSidang,
			tempatSidang,
			pengurus: pengurusAccess
		};
	};

	const openDeleteModal = (id) => {
		deleteTargetId = id;
		deleteModal = true;
	};

	const handleAddDebitor = async () => {
		loading = true;
		try {
			const response = await fetch('/api/debitor', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(dataDebitor)
			});
			const result = await response.json();
			form = result;
			if (result.success) {
				createModal = false;
				showToast(result.message, 'success');
				let newDebitor = result.data;
				debitor = [...debitor, newDebitor];
				dataDebitor = {
					nama: '',
					tglSidang: '',
					tempatSidang: '',
					pengurus: []
				};
			} else {
				showToast(result.message, 'error');
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	};

	const handleEditDebitor = async () => {
		loading = true;
		try {
			const response = await fetch(`/api/debitor/${editTargetId}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(dataDebitor)
			});
			const result = await response.json();
			form = result;
			if (result.success) {
				editModal = false;
				showToast(result.message, 'success');
				let updatedDebitor = result.data;
				debitor = updatedDebitor;
				dataDebitor = {
					nama: '',
					tglSidang: '',
					tempatSidang: '',
					pengurus: []
				};
			} else {
				showToast(result.message, 'error');
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
			editTargetId = null;
			editModal = false;
		}
	};

	const handleDeleteDebitor = async () => {
		try {
			const response = await fetch(`/api/debitor/${deleteTargetId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const result = await response.json();
			if (result.success) {
				showToast(result.message, 'success');
				let updatedDebitor = result.data;
				debitor = updatedDebitor;
			} else {
				showToast(result.message, 'error');
			}
		} catch (error) {
			console.error(error);
		} finally {
			deleteTargetId = null;
			deleteModal = false;
		}
	};

	async function copyText(name) {
		const link = name.replace(/\s/g, '-').toLowerCase();
		await navigator.clipboard.writeText(`${PUBLIC_SITE_URL}/${link}`);
		showToast(`Link ${name} berhasil disalin!`, 'success');
	}

	let toggleDropdown = false; // dropdown toggle
	let currentPage = 1; // default posisi halaman saat ini
	let totalPages = 1; // default total halaman
	$: itemsPerPage = 10; // total item yang akan ditampilkan
	let searchKeyword = ''; // keyword untuk searching
	let paginatedData = [];
	let filteredData = [];
	let searchColumns = ['nama', 'uid'];

	$: {
		filteredData = debitor.filter((data) => {
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
		<BreadcrumbItem>List Debitor</BreadcrumbItem>
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
			<div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
				{#if roleId === 1}
					<Button on:click={openCreateModal}>
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

						Tambah Debitor</Button
					>
				{/if}
			</div>
		</div>
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
				<thead
					class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
				>
					<tr>
						<th scope="col" class="px-3 py-3">No</th>
						<th scope="col" class="px-3 py-3">Nama Debitor</th>
						<th scope="col" class="px-3 py-3">ID Debitor</th>
						<th scope="col" class="px-3 py-3">Tanggal Sidang</th>
						<th scope="col" class="px-3 py-3">Tempat Sidang</th>
						{#if roleId === 1 || roleId === 2}
							<th scope="col" class="px-4 py-3">Aksi</th>
						{/if}
					</tr>
				</thead>
				<tbody>
					{#if paginatedData.length === 0}
						<tr class="border-b dark:border-gray-700">
							<td class="px-4 py-3 text-center" colspan={roleId === 1 || roleId === 2 ? 6 : 5 }>No data found.</td>
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
									>{data.nama}</th
								>
								<th
									scope="row"
									class="w-10 whitespace-nowrap text-wrap px-4 py-3 font-medium text-gray-900 dark:text-white"
									>{data.uid}</th
								>
								<td class="px-4 py-3 capitalize">{data.tglSidang}</td>
								<td class="px-4 py-3 capitalize">{data.tempatSidang}</td>
								{#if roleId === 1 || roleId === 2}
									<td class="px-4 py-3">
										<div class="inline-flex rounded-md shadow-sm" role="group">
											<button
												type="button"
												on:click={() => copyText(data.nama)}
												class={`inline-flex items-center ${roleId === 1 ? 'rounded-s-lg' : 'rounded-lg'} border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500`}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													class="me-2 h-3 w-3"
												>
													<path
														fill-rule="evenodd"
														d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z"
														clip-rule="evenodd"
													/>
												</svg>

												Copy
											</button>
											{#if roleId === 1}
												<button
													type="button"
													on:click={openEditModal(
														data.id,
														data.nama,
														data.tglSidang,
														data.tempatSidang,
														data.pengurusAccess
													)}
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
												</button>
												<button
													type="button"
													on:click={() => openDeleteModal(data.id)}
													class="inline-flex items-center rounded-e-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
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
											{/if}
										</div>
									</td>
								{/if}
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
<!-- Create Modal  -->
<Modal
	bind:open={createModal}
	size="sm"
	autoclose={false}
	class="w-full"
	backdropClass="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
	bodyClass="p-6 space-y-6 flex-1 overflow-y-visible overscroll-contain"
>
	<form method="POST" class="flex flex-col space-y-4" on:submit|preventDefault={handleAddDebitor}>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Tambah debitor</h3>
		<div>
			<label
				for="Nama"
				class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'nama') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
				>Nama</label
			>
			<input
				type="text"
				name="nama"
				id="Nama"
				placeholder="Nama"
				bind:value={dataDebitor.nama}
				class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'nama') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
			/>
			{#if form?.errors?.find((error) => error.field === 'nama')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'nama').message}
				</p>
			{/if}
		</div>
		<div>
			<label
				for="tglSidang"
				class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'tglSidang') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
				>Tanggal Sidang</label
			>
			<div class="relative">
				<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
					<svg
						class={`${form?.errors?.find((error) => error.field === 'tglSidang') ? 'text-red-900 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'} h-4 w-4 `}
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
						/>
					</svg>
				</div>
				<DatePicker
					bind:startDate={dataDebitor.tglSidang}
					invalid={form?.errors?.find((error) => error.field === 'tglSidang')}
				/>
			</div>
			{#if form?.errors?.find((error) => error.field === 'tglSidang')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'tglSidang').message}
				</p>
			{/if}
		</div>
		<div>
			<label
				for="tempatSidang"
				class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'tempatSidang') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
			>
				<span>Alamat</span>
				<textarea
					id="textarea-id"
					placeholder="Tempat Sidang"
					rows="2"
					name="tempatSidang"
					bind:value={dataDebitor.tempatSidang}
					class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'tempatSidang') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
				></textarea>
				{#if form?.errors?.find((error) => error.field === 'tempatSidang')}
					<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
						{form?.errors?.find((error) => error.field === 'tempatSidang').message}
					</p>
				{/if}
			</label>
		</div>
		<div>
			<label
				for="Pengurus"
				class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'pengurus') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
			>
				<span>Pengurus</span>
				<MultiSelect
					--sms-border-radius="0.5rem"
					--sms-border={` 1px solid ${form?.errors?.find((error) => error.field === 'pengurus') ? '#ef4444' : '#d1d5db'}`}
					--sms-focus-border={` 2px solid ${form?.errors?.find((error) => error.field === 'pengurus') ? '#ef4444' : '#3b82f6'}`}
					--sms-padding="0.625rem"
					--sms-bg={` ${form?.errors?.find((error) => error.field === 'pengurus') ? '#fef2f2' : '#f9fafb'}`}
					--sms-text-color={` ${form?.errors?.find((error) => error.field === 'pengurus') ? '#7f1d1d' : '#111827'}`}
					--sms-placeholder-color={` ${form?.errors?.find((error) => error.field === 'pengurus') ? '#b91c1c' : '#9ca3af'}`}
					--sms-font-size="0.875rem"
					--sms-margin="8px 0"
					options={listPengurus}
					placeholder="Pilih pengurus"
					name="pengurus"
					bind:value={dataDebitor.pengurus}
					let:option
				>
					<span>{option.label}</span>
				</MultiSelect>
				{#if form?.errors?.find((error) => error.field === 'pengurus')}
					<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
						{form?.errors?.find((error) => error.field === 'pengurus').message}
					</p>
				{/if}
			</label>
		</div>
		<Button type="submit">
			{#if loading}
				<Spinner class="me-2" size="4" color="white" />
			{:else}
				Tambah debitor
			{/if}
		</Button>
	</form>
</Modal>

<!-- Edit Modal  -->
<Modal
	bind:open={editModal}
	size="sm"
	autoclose={false}
	class="w-full"
	backdropClass="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
	bodyClass="p-6 space-y-6 flex-1 overflow-y-visible overscroll-contain"
>
	<form method="PUT" class="flex flex-col space-y-4" on:submit|preventDefault={handleEditDebitor}>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Edit debitor</h3>
		<div>
			<label
				for="Nama"
				class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'nama') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
				>Nama</label
			>
			<input
				type="text"
				name="nama"
				id="Nama"
				placeholder="Nama"
				bind:value={dataDebitor.nama}
				class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'nama') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
			/>
			{#if form?.errors?.find((error) => error.field === 'nama')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'nama').message}
				</p>
			{/if}
		</div>
		<div>
			<label
				for="tglSidang"
				class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'tglSidang') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
				>Tanggal Sidang</label
			>
			<div class="relative">
				<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
					<svg
						class={`${form?.errors?.find((error) => error.field === 'tglSidang') ? 'text-red-900 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'} h-4 w-4 `}
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
						/>
					</svg>
				</div>
				<DatePicker
					bind:startDate={dataDebitor.tglSidang}
					invalid={form?.errors?.find((error) => error.field === 'tglSidang')}
				/>
			</div>
			{#if form?.errors?.find((error) => error.field === 'tglSidang')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'tglSidang').message}
				</p>
			{/if}
		</div>
		<div>
			<label
				for="tempatSidang"
				class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'tempatSidang') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
			>
				<span>Alamat</span>
				<textarea
					id="textarea-id"
					placeholder="Tempat Sidang"
					rows="2"
					name="tempatSidang"
					bind:value={dataDebitor.tempatSidang}
					class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'tempatSidang') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
				></textarea>
				{#if form?.errors?.find((error) => error.field === 'tempatSidang')}
					<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
						{form?.errors?.find((error) => error.field === 'tempatSidang').message}
					</p>
				{/if}
			</label>
		</div>
		<div>
			<label
				for="Pengurus"
				class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'pengurus') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
			>
				<span>Pengurus</span>
				<MultiSelect
					--sms-border-radius="0.5rem"
					--sms-border={` 1px solid ${form?.errors?.find((error) => error.field === 'pengurus') ? '#ef4444' : '#d1d5db'}`}
					--sms-focus-border={` 2px solid ${form?.errors?.find((error) => error.field === 'pengurus') ? '#ef4444' : '#3b82f6'}`}
					--sms-padding="0.625rem"
					--sms-bg={` ${form?.errors?.find((error) => error.field === 'pengurus') ? '#fef2f2' : '#f9fafb'}`}
					--sms-text-color={` ${form?.errors?.find((error) => error.field === 'pengurus') ? '#7f1d1d' : '#111827'}`}
					--sms-placeholder-color={` ${form?.errors?.find((error) => error.field === 'pengurus') ? '#b91c1c' : '#9ca3af'}`}
					--sms-font-size="0.875rem"
					--sms-margin="8px 0"
					options={listPengurus}
					selected={selectedPengurus}
					placeholder="Pilih pengurus"
					name="pengurus"
					bind:value={dataDebitor.pengurus}
					let:option
				>
					<span>{option.label}</span>
				</MultiSelect>
				{#if form?.errors?.find((error) => error.field === 'pengurus')}
					<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
						{form?.errors?.find((error) => error.field === 'pengurus').message}
					</p>
				{/if}
			</label>
		</div>
		<Button type="submit">
			{#if loading}
				<Spinner class="me-2" size="4" color="white" />
			{:else}
				Ubah debitor
			{/if}
		</Button>
	</form>
</Modal>

<!-- delete modal -->
<Modal bind:open={deleteModal} size="xs" autoclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Anda yakin akan menghapus debitor ini?
		</h3>
		<Button color="red" class="me-2" on:click={handleDeleteDebitor}>Ya, Saya yakin</Button>
		<Button color="alternative">Tidak, batal</Button>
	</div>
</Modal>
