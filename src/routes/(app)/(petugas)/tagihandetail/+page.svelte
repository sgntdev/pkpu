<script>
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Spinner,
		Modal,
		Dropdown,
		DropdownItem,
		Badge,
		Indicator,
		Radio,
		Search
	} from 'flowbite-svelte';
	import { showToast } from '$lib/toastStore';
	import { writable, derived } from 'svelte/store';
	import { getContext } from 'svelte';
	import {
		ExclamationCircleOutline,
		ChevronDownOutline,
		FilterOutline
	} from 'flowbite-svelte-icons';
	import { utils, writeFileXLSX } from 'xlsx';

	export let data;
	const { sifatTagihanData, debitorData, token, roleId } = data.body;
	// let tagihan;
	const chooseDebitor = getContext('Choose');
	const tagihan = writable([]);
	tagihan.set(data.body.tagihan);
	let tagihanInputsByRow = $tagihan.map(() => []);
	let loading = false;
	let openRow;
	// Modal Delete
	let deleteModal = false;
	let editModal = false;
	let deleteTargetId;
	let deleteTargetTagihanId;

	const tagihanByDebitor = derived([chooseDebitor, tagihan], ([$chooseDebitor, $tagihan]) =>
		$chooseDebitor === '' ? $tagihan : $tagihan.filter((item) => item.debitorId === $chooseDebitor)
	);
	//Edit
	let dataEdit = {
		sifatTagihanId: '',
		tipe: '',
		amount: ''
	};

	const toggleRow = (i) => {
		openRow = openRow === i ? null : i;
	};

	const formatPrice = (price) => {
		if (typeof price !== 'string') {
			price = price.toString();
		}
		const digits = price.replace(/,/g, '');
		const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return formatted;
	};
	function tambahInput(index, id) {
		openRow = openRow === null || openRow === undefined ? index : openRow;
		tagihanInputsByRow[index] = [
			...tagihanInputsByRow[index],
			{ tagihanId: id, tipe: '', amount: 0, sifatTagihanId: '' }
		];
	}

	function hapusInput(rowIndex, TagihanDetailIndex) {
		tagihanInputsByRow[rowIndex] = tagihanInputsByRow[rowIndex].filter(
			(_, i) => i !== TagihanDetailIndex
		);
	}

	function updateAmount(rowIndex, TagihanDetailIndex, event) {
		tagihanInputsByRow[rowIndex][TagihanDetailIndex].amount = event.target.value;
	}

	function validateForm(index) {
		const inputs = tagihanInputsByRow[index];
		let isValid = true;
		inputs.forEach((input) => {
			if (input.sifatTagihanId === '' || input.tipe === '' || input.amount === '') {
				isValid = false;
			}
		});
		return isValid;
	}

	function noValidationPayload(inputs) {
		return inputs.map(({ showValidation, ...rest }) => rest);
	}

	async function submitForm(index) {
		if (validateForm(index)) {
			loading = true;
			try {
				const sanitizedPayload = noValidationPayload(tagihanInputsByRow[index]);
				const payload = JSON.stringify(sanitizedPayload);

				const response = await fetch('/api/tagihandetail', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					},
					body: payload
				});
				const result = await response.json();
				if (result.success) {
					// Mengubah tagihanInputsByRow[rowIndex] menjadi array kosong
					tagihanInputsByRow[index] = [];
					showToast(result.message, 'success');
					const updatedDataResponse = await fetch('/api/tagihan', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`
						}
					});
					const updatedData = await updatedDataResponse.json();
					tagihan.set(updatedData.data);
				} else {
					showToast(result.message, 'error');
				}
			} catch (err) {
				console.error('client', err);
			} finally {
				loading = false;
			}
		} else {
			// Show validation errors
			tagihanInputsByRow = tagihanInputsByRow.map((row, rowIndex) => {
				if (rowIndex === index) {
					return row.map((input) => ({
						...input,
						showValidation: true
					}));
				}
				return row;
			});
		}
	}

	const handleDelete = async () => {
		try {
			const response = await fetch(`api/tagihandetail/${deleteTargetTagihanId}/${deleteTargetId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const result = await response.json();
			if (result.success) {
				showToast(result.message, 'success');
				const updatedDataResponse = await fetch('/api/tagihan', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const updatedData = await updatedDataResponse.json();
				tagihan.set(updatedData.data);
			} else {
				showToast(result.message, 'error');
			}
		} catch (error) {
			console.error(error);
		} finally {
			deleteTargetId = null;
			deleteTargetTagihanId = null;
			deleteModal = false;
		}
	};

	const handleEdit = async () => {
		loading = true;
		try {
			const payload = JSON.stringify(dataEdit);
			const response = await fetch(`api/tagihandetail/${dataEdit.tagihanid}/${dataEdit.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: payload
			});
			const result = await response.json();
			if (result.success) {
				editModal = false;
				dataEdit = {
					sifatTagihanId: '',
					tipe: '',
					amount: ''
				};
				showToast(result.message, 'success');
				const updatedDataResponse = await fetch('/api/tagihan', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const updatedData = await updatedDataResponse.json();
				tagihan.set(updatedData.data);
			} else {
				showToast(result.message, 'error');
			}
		} catch (err) {
			console.error('client', err);
		} finally {
			loading = false;
		}
	};

	const openEditModal = (data) => {
		dataEdit = {
			id: data.id,
			tagihanId: data.tagihanId,
			sifatTagihanId: data.sifatTagihanId,
			tipe: data.tipe,
			amount: data.amount
		};
		editModal = true;
	};

	const openDeleteModal = (id, idTagihan) => {
		deleteModal = true;
		deleteTargetId = id;
		deleteTargetTagihanId = idTagihan;
	};

	//Dropdown total item show
	let dropdownOpen = false;
	//pagination
	let currentPage = 1;
	let totalPages = 1;
	$: itemsPerPage = 10;
	let searchText = '';
	let filterStatus = [0, 1, 2];
	let paginatedTagihan = [];
	let filteredTagihan = [];
	let selectedDebitor = '';
	let searchDebitor = '';

	let debitorResult = [];
	$: debitorResult = debitorData.filter((data) =>
		data.nama.toLowerCase().includes(searchDebitor.toLowerCase())
	);
	function toggleselectedDebitor(debitorId) {
		selectedDebitor = debitorId;
	}

	let namaDebitor = '';

	$: namaDebitor = selectedDebitor
		? debitorData.find((debitor) => debitor.id === selectedDebitor)?.nama
		: 'Filter';

	function toggleFilterStatus(status) {
		if (status === 'all') {
			filterStatus = [0, 1, 2];
		} else if (filterStatus.includes(status)) {
			filterStatus = filterStatus.filter((s) => s === status);
		} else {
			filterStatus = [status];
		}
	}
	// Menghitung data yang dipaginate
	$: {
		filteredTagihan = $tagihanByDebitor.filter(
			(data) =>
				data.Kreditor.nama.toLowerCase().includes(searchText.toLowerCase()) &&
				filterStatus.includes(data.status) &&
				(selectedDebitor === '' || selectedDebitor === data.debitorId)
		);

		totalPages = Math.ceil(filteredTagihan.length / itemsPerPage);

		paginatedTagihan = filteredTagihan.slice(
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
		dropdownOpen = false;
	}
	function formatDate(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	$: formattedData = $tagihanByDebitor
		.filter((data) => data.status === 1)
		.map((data, index) => {
			let total = parseFloat(data.denda) + parseFloat(data.hutangPokok) + parseFloat(data.bunga);
			if (data.TagihanItem.length === 0) {
				return [
					{
						No: index + 1,
						namaKreditor: data.Kreditor.nama,
						totalTagihan: total,
						preferent: data.sifatTagihanId === 2 ? total : null,
						separatis: data.sifatTagihanId === 3 ? total : null,
						konkuren: data.sifatTagihanId === 1 ? total : null,
						keterangan: null
					}
				];
			} else {
				const items = data.TagihanItem.map((item, itemIndex) => ({
					No: itemIndex === 0 ? index + 1 : '',
					namaKreditor: itemIndex === 0 ? data.Kreditor.nama : '',
					totalTagihan:
						itemIndex === 0
							? parseFloat(data.denda) + parseFloat(data.hutangPokok) + parseFloat(data.bunga)
							: '',
					preferent: item.sifatTagihanId === 2 ? parseFloat(item.amount) : null,
					separatis: item.sifatTagihanId === 3 ? parseFloat(item.amount) : null,
					konkuren: item.sifatTagihanId === 1 ? parseFloat(item.amount) : null,
					keterangan: item.tipe
				}));

				return items;
			}
		})
		.flat();

	function exportFile() {
		// Create worksheet with headers and labels
		const ws = utils.aoa_to_sheet([
			['No', 'Nama & Alamat Kreditor', 'Total Tagihan Yang Diajukan (Rp)', 'DIAKUI KURATOR'],
			['', '', '', 'PREFERENT', 'SEPARATIS', 'KONKUREN', 'KETERANGAN']
		]);

		// Add data to worksheet
		utils.sheet_add_json(ws, formattedData, { skipHeader: true, origin: -1 });

		// Merge header cells
		ws['!merges'] = [
			{ s: { c: 0, r: 0 }, e: { c: 0, r: 1 } }, // A1:A2
			{ s: { c: 1, r: 0 }, e: { c: 1, r: 1 } }, // B1:B2
			{ s: { c: 2, r: 0 }, e: { c: 2, r: 1 } }, // C1:C2
			{ s: { c: 3, r: 0 }, e: { c: 6, r: 0 } } // D1:G1
		];
		// Set column widths
		ws['!cols'] = [
			{ wpx: 20 }, // Column A
			{ wpx: 140 }, // Column B
			{ wpx: 180 }, // Column C
			{ wpx: 150 }, // Column D
			{ wpx: 150 }, // Column E
			{ wpx: 150 }, // Column F
			{ wpx: 150 } // Column G
		];

		// Apply currency format to columns C, D, E, and F
		const currencyColumns = [2, 3, 4, 5];
		for (let col of currencyColumns) {
			for (let row = 2; row <= formattedData.length + 1; row++) {
				const cellRef = utils.encode_cell({ c: col, r: row });
				if (!ws[cellRef]) ws[cellRef] = {};
				ws[cellRef].z = 'Rp #,##0'; // Apply currency format
			}
		}

		// Determine row merges for columns No, namaKreditor, and totalTagihan
		let rowIndex = 2; // Start from the third row in the Excel sheet (0-based index)
		$tagihanByDebitor.filter((data) => data.status === 1).forEach((data, index) => {
			const tagihanItemCount = data.TagihanItem.length;
			console.log(data, tagihanItemCount, index);
			if (tagihanItemCount > 0) {
				const startRow = rowIndex;
				const endRow = rowIndex + tagihanItemCount - 1;
				console.log(startRow, endRow);
				ws['!merges'] = ws['!merges'] || [];
				ws['!merges'].push(
					{ s: { c: 0, r: startRow }, e: { c: 0, r: endRow } }, // Merge No column
					{ s: { c: 1, r: startRow }, e: { c: 1, r: endRow } }, // Merge namaKreditor column
					{ s: { c: 2, r: startRow }, e: { c: 2, r: endRow } } // Merge totalTagihan column
				);
				rowIndex = endRow + 1;
			} else {
				rowIndex += 1;
			}
		});

		// Create and write workbook
		const wb = utils.book_new();
		const date = new Date();
		const formattedDate = formatDate(date);
		utils.book_append_sheet(wb, ws, 'Data');
		writeFileXLSX(wb, `${formattedDate}-tagihan-pkpu.xlsx`);
	}
</script>

<div class="space-y-4">
	<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
		<BreadcrumbItem href="/dashboard" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem>List Tagihan</BreadcrumbItem>
	</Breadcrumb>

	<div
		class="border-1 relative overflow-hidden border border-gray-200 bg-white dark:bg-gray-800 sm:rounded-lg"
	>
		<div
			class="mx-4 flex flex-col items-center justify-between space-y-3 border-b-[1px] border-gray-200 py-4 md:flex-row md:space-x-4 md:space-y-0"
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
						<Dropdown triggeredBy="#items" bind:open={dropdownOpen}>
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
								bind:value={searchText}
							/>
						</div>
					</form>
				</div>
			</div>
			<div
				class="flex w-full flex-shrink-0 flex-col items-stretch justify-end space-y-2 md:w-auto md:flex-row md:items-center md:space-x-3 md:space-y-0"
			>
				<div>
					<Button color="green" on:click={exportFile} class="w-full">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mr-2 h-3.5 w-3.5">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
						  </svg>
						Export xlsx</Button
					>
				</div>
				{#if roleId === 1}
					<div>
						<Button color="light" class="w-full">
							{namaDebitor}
							<FilterOutline class="ml-2 h-4 w-4" /></Button
						>
						<Dropdown placement="bottom" class="max-h-44 min-h-5 overflow-y-auto px-3 pb-3 text-sm">
							<div slot="header" class="p-3">
								<Search size="md" bind:value={searchDebitor} />
							</div>
							{#each debitorResult as { id, nama }}
								<li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
									<Radio
										bind:group={selectedDebitor}
										value={id}
										on:change={() => toggleselectedDebitor(id)}
										name="debitor">{nama}</Radio
									>
								</li>
							{/each}
							<div slot="footer" class="px-3 py-1">
								<Button size="xs" color="light" on:click={() => (selectedDebitor = '')}
									>Reset</Button
								>
							</div>
						</Dropdown>
					</div>
				{/if}
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
				<label
					for="inline-2-radio"
					class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Verified</label
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
				<thead
					class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
				>
					<tr>
						<th scope="col" class="px-4 py-3">No</th>
						<th></th>
						<th scope="col" class="px-4 py-3">Nama Kreditor</th>
						<th scope="col" class="max-w-20 px-4 py-3">Golongan</th>
						<th scope="col" class="px-4 py-3">Hutang Pokok</th>
						<th scope="col" class="px-4 py-3">Bunga</th>
						<th scope="col" class="px-4 py-3">Denda</th>
						<th scope="col" class="px-4 py-3">Status</th>
						<th scope="col" class="px-4 py-3">
							<span class="sr-only">Aksi</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{#if paginatedTagihan.length === 0}
						<tr class="border-b dark:border-gray-700">
							<td class="px-4 py-3 text-center" colspan="9">No data found.</td>
						</tr>
					{:else}
						{#each paginatedTagihan as data, index (data)}
							<tr
								class={` border-b hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600 ${openRow === index ? 'border-t-4 bg-gray-50' : 'bg-white'}`}
								on:dblclick={() => toggleRow(index)}
							>
								<td class="px-4 py-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
								<td>
									{#if openRow === index}
										<button on:click={() => toggleRow(index)} type="button">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="3"
												stroke="currentColor"
												class="h-4 w-4 stroke-gray-800"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="m4.5 15.75 7.5-7.5 7.5 7.5"
												/>
											</svg>
										</button>
									{:else}
										<button on:click={() => toggleRow(index)} type="button">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="3"
												stroke="currentColor"
												class="h-4 w-4 stroke-gray-800"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="m19.5 8.25-7.5 7.5-7.5-7.5"
												/>
											</svg>
										</button>
									{/if}
								</td>
								<th
									scope="row"
									class="w-72 whitespace-nowrap text-wrap px-4 py-3 font-medium text-gray-900 dark:text-white"
									>{data.Kreditor.nama}</th
								>
								<td class="max-w-20 px-4 py-3">{data.SifatTagihan.sifat}</td>
								<td class="px-4 py-3">Rp. {formatPrice(parseFloat(data.hutangPokok))}</td>
								<td class="px-4 py-3">Rp. {formatPrice(parseFloat(data.bunga))}</td>
								<td class="px-4 py-3">Rp. {formatPrice(parseFloat(data.denda))}</td>
								<td class="px-4 py-3">
									{#if data.status === 0}
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
									{/if}
								</td>
								<td class="px-4 py-3">
									<div class="inline-flex rounded-md shadow-sm" role="group">
										<a
											href={`/tagihandetail/${data.id}`}
											class={`inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500`}
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
									</div>
								</td>
							</tr>

							{#if openRow === index}
								<tr>
									<td colspan="9" class="p-0">
										<table
											class="w-full table-auto border-b-4 bg-gray-50 text-left text-sm text-gray-500 dark:text-gray-400 rtl:text-right"
										>
											<thead class="text-xs uppercase text-gray-700">
												<tr>
													<th scope="col" class="w-3/12 px-6 py-3">Golongan</th>
													<th scope="col" class="w-4/12 px-6 py-3">Tipe</th>
													<th scope="col" class="w-4/12 px-6 py-3 dark:bg-gray-800">Amount</th>
													<th scope="col" class="w-1/12 px-6 py-3">Action</th>
												</tr>
											</thead>
											<tbody>
												{#if data.TagihanItem.length > 0}
													{#each data.TagihanItem as item, index (item)}
														<tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
															<th
																scope="row"
																class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
															>
																{item.SifatTagihan.sifat}
															</th>
															<td class="px-6 py-4 capitalize">
																{item.tipe}
															</td>
															<td class="px-6 py-4 dark:bg-gray-800">
																Rp. {formatPrice(parseFloat(item.amount))}
															</td>
															<td class="px-6 py-4">
																{#if roleId === 1 || roleId === 2}
																	{#if data.status !== 1}
																		<div class="flex flex-row space-x-3">
																			<button type="button" on:click={() => openEditModal(item)}>
																				<svg
																					xmlns="http://www.w3.org/2000/svg"
																					fill="none"
																					viewBox="0 0 24 24"
																					stroke-width="1.5"
																					stroke="currentColor"
																					class="h-5 w-5 stroke-gray-400 stroke-2 hover:stroke-gray-700"
																				>
																					<path
																						stroke-linecap="round"
																						stroke-linejoin="round"
																						d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
																					/>
																				</svg>
																			</button>
																			<button
																				type="button"
																				on:click={() => openDeleteModal(item.id, item.tagihanId)}
																			>
																				<svg
																					xmlns="http://www.w3.org/2000/svg"
																					fill="none"
																					viewBox="0 0 24 24"
																					stroke-width="1.5"
																					stroke="currentColor"
																					class="h-5 w-5 stroke-gray-400 stroke-2 hover:stroke-gray-700"
																				>
																					<path
																						stroke-linecap="round"
																						stroke-linejoin="round"
																						d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
																					/>
																				</svg>
																			</button>
																		</div>
																	{/if}
																{/if}
															</td>
														</tr>
													{/each}
												{/if}
												{#if tagihanInputsByRow[index].length > 0}
													{#each tagihanInputsByRow as tagihanInputs, index}
														{#each tagihanInputs as tagihanDetail, TagihanDetailIndex (tagihanDetail)}
															<tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
																<td class="px-6 py-4">
																	<select
																		id="sifatTagihan"
																		name="sifatTagihanId"
																		bind:value={tagihanDetail.sifatTagihanId}
																		class={`block w-full rounded-lg border p-2.5 text-sm ${tagihanDetail.showValidation && tagihanDetail.sifatTagihanId === '' ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
																	>
																		<option value="" selected disabled>Pilih Sifat Tagihan</option>
																		{#each sifatTagihanData as { id, sifat }}
																			<option value={id}>{sifat}</option>
																		{/each}
																	</select>
																	{#if tagihanDetail.showValidation && tagihanDetail.sifatTagihanId === ''}
																		<p
																			class="mt-2 text-xs font-normal text-red-700 dark:text-red-500"
																		>
																			Sifat Tagihan harus dipilih
																		</p>
																	{/if}
																</td>
																<td class="px-6 py-4">
																	<select
																		id="tipeTagihan"
																		name="tipeTagihan"
																		bind:value={tagihanDetail.tipe}
																		class={`block w-full rounded-lg border p-2.5 text-sm ${tagihanDetail.showValidation && tagihanDetail.tipe === '' ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
																	>
																		<option value="" selected disabled>Pilih Tipe Tagihan</option>
																		<option value="bunga">Bunga</option>
																		<option value="denda">Denda</option>
																		<option value="tagihan">Tagihan</option>
																	</select>
																	{#if tagihanDetail.showValidation && tagihanDetail.tipe === ''}
																		<p
																			class="mt-2 text-xs font-normal text-red-700 dark:text-red-500"
																		>
																			Tipe Tagihan harus dipilih
																		</p>
																	{/if}
																</td>
																<td class="px-6 py-4">
																	<div class="relative">
																		<div
																			class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5"
																		>
																			<p
																				class={`${tagihanDetail.showValidation && tagihanDetail.amount === '' ? 'text-red-900 dark:text-red-500' : 'text-gray-500'}`}
																			>
																				Rp.
																			</p>
																		</div>
																		<input
																			type="text"
																			name="Amount Tagihan"
																			placeholder="Amount Tagihan"
																			id="amountTagihan"
																			bind:value={tagihanDetail.amount}
																			on:input={(event) =>
																				updateAmount(index, TagihanDetailIndex, event)}
																			class={`block w-full rounded-lg border p-2.5 ps-10 text-sm ${tagihanDetail.showValidation && tagihanDetail.amount === '' ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
																		/>
																	</div>
																	{#if tagihanDetail.showValidation && tagihanDetail.amount === ''}
																		<p
																			class="mt-2 text-xs font-normal text-red-700 dark:text-red-500"
																		>
																			Amount Tagihan tidak boleh kosong
																		</p>
																	{/if}
																</td>
																<td class="px-6 py-4">
																	<div class="flex flex-row space-x-3">
																		<button type="button" on:click={() => submitForm(index)}>
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				fill="none"
																				viewBox="0 0 24 24"
																				stroke-width="1.5"
																				stroke="currentColor"
																				class="h-5 w-5 stroke-gray-400 stroke-2 hover:stroke-gray-700"
																			>
																				<path
																					stroke-linecap="round"
																					stroke-linejoin="round"
																					d="m4.5 12.75 6 6 9-13.5"
																				/>
																			</svg>
																		</button>
																		<button
																			type="button"
																			on:click={() => hapusInput(index, TagihanDetailIndex)}
																		>
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				fill="none"
																				viewBox="0 0 24 24"
																				stroke-width="1.5"
																				stroke="currentColor"
																				class="h-5 w-5 stroke-gray-400 stroke-2 hover:stroke-gray-700"
																			>
																				<path
																					stroke-linecap="round"
																					stroke-linejoin="round"
																					d="M6 18 18 6M6 6l12 12"
																				/>
																			</svg>
																		</button>
																	</div>
																</td>
															</tr>
														{/each}
													{/each}
												{/if}
												<tr>
													<th
														scope="row"
														class="whitespace-nowrap px-6 py-4 text-center font-bold uppercase text-gray-900"
														colspan="2"
													>
														Total
													</th>
													<td class="px-6 py-4 font-semibold text-gray-900"
														>Rp. {formatPrice(
															data.TagihanItem.reduce((sum, item) => sum + parseInt(item.amount), 0)
														)}</td
													>
													<td class="px-6 py-4">
														{#if roleId === 1 || roleId === 2}
															{#if tagihanInputsByRow[index].length === 0 && data.status !== 1}
																<button
																	type="button"
																	on:click={() => tambahInput(index, data.id)}
																	class="flex flex-row space-x-1 hover:text-gray-700"
																>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		fill="none"
																		viewBox="0 0 24 24"
																		stroke-width="1.5"
																		stroke="currentColor"
																		class="h-5 w-5"
																	>
																		<path
																			stroke-linecap="round"
																			stroke-linejoin="round"
																			d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
																		/>
																	</svg>
																	<p>Revisi</p>
																</button>
															{/if}
														{/if}
													</td>
												</tr>
											</tbody>
										</table>
									</td>
								</tr>
							{/if}
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
					{#if filteredTagihan.length === 0}
						0-0
					{:else}
						{(currentPage - 1) * itemsPerPage + 1}-{Math.min(
							currentPage * itemsPerPage,
							filteredTagihan.length
						)}
					{/if}
				</span>
				of
				<span class="font-semibold text-gray-900 dark:text-white">{filteredTagihan.length}</span>
			</span>
			<ul class="inline-flex items-stretch -space-x-px">
				<li>
					<button
						on:click={() => goToPage(currentPage - 1)}
						disabled={currentPage === 1 || paginatedTagihan.length === 0}
						class={`ml-0 flex h-full items-center justify-center rounded-l-lg border border-gray-300 bg-white px-3 py-1.5 leading-tight ${currentPage === 1 || paginatedTagihan.length === 0 ? 'cursor-not-allowed text-gray-300 hover:bg-white hover:text-gray-300' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'}`}
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
						disabled={currentPage === totalPages || paginatedTagihan.length === 0}
						class={`ml-0 flex h-full items-center justify-center rounded-r-lg border border-gray-300 bg-white px-3 py-1.5 leading-tight ${currentPage === totalPages || paginatedTagihan.length === 0 ? 'cursor-not-allowed text-gray-300 hover:bg-white hover:text-gray-300' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white'}`}
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
<!-- delete modal -->
<Modal bind:open={deleteModal} size="xs" autoclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Anda yakin akan menghapus tagihan detail ini?
		</h3>
		<Button color="red" class="me-2" on:click={handleDelete}>Ya, Saya yakin</Button>
		<Button color="alternative">Tidak, batal</Button>
	</div>
</Modal>

<Modal
	bind:open={editModal}
	size="xs"
	autoclose={false}
	class="w-full"
	backdropClass="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
	bodyClass="p-6 space-y-6 flex-1 overflow-y-visible overscroll-contain"
>
	<form method="PUT" class="flex flex-col space-y-4" on:submit|preventDefault={handleEdit}>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Edit detail tagihan</h3>
		<div>
			<label
				for="sifatTagihan"
				class="mb-2 block text-left text-sm font-medium text-gray-900 dark:text-white"
			>
				Sifat/Golongan Tagihan
			</label>
			<select
				id="sifatTagihan"
				name="sifatTagihanId"
				bind:value={dataEdit.sifatTagihanId}
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-left text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			>
				<option value="" selected disabled>Pilih Sifat Tagihan</option>
				{#each sifatTagihanData as { id, sifat }}
					<option value={id}>{sifat}</option>
				{/each}
			</select>
		</div>
		<div>
			<label
				for="tipeTagihan"
				class="mb-2 block text-left text-sm font-medium text-gray-900 dark:text-white"
			>
				Tipe Detail Tagihan
			</label>
			<select
				id="tipeTagihan"
				name="tipeTagihan"
				bind:value={dataEdit.tipe}
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			>
				<option value="" selected disabled>Pilih Tipe Tagihan</option>
				<option value="bunga">Bunga</option>
				<option value="denda">Denda</option>
				<option value="tagihan">Tagihan</option>
			</select>
		</div>
		<div>
			<label
				for="amountTagihan"
				class="mb-2 block text-left text-sm font-medium text-gray-900 dark:text-white"
			>
				Amount
			</label>
			<div class="relative">
				<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5">
					<p class="text-gray-500">Rp.</p>
				</div>
				<input
					type="text"
					name="Amount Tagihan"
					placeholder="Amount Tagihan"
					id="amountTagihan"
					bind:value={dataEdit.amount}
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				/>
			</div>
		</div>
		<Button type="submit">
			{#if loading}
				<Spinner color="white" size={4} />
			{:else}
				Ubah detail tagihan
			{/if}
		</Button>
	</form></Modal
>
