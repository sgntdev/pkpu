<script>
	import { showToast } from '$lib/toastStore';
	import { PUBLIC_SITE_URL } from '$env/static/public';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Modal,
		Spinner
	} from 'flowbite-svelte';
	import DatePicker from '../../../../lib/components/DatePicker.svelte';
	import { format } from 'date-fns';
	import MultiSelect from 'svelte-multiselect';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	export let data;
	const { token, roleId, pengurus } = data.body;
	console.log(pengurus);
	let debitor = data.body.debitor;
	let selectedPengurus;
	let createModal = false;
	let editModal = false;
	let deleteModal = false;
	let editTargetId;
	let deleteTargetId;
	let form;
	let loading = false;

	const listPengurus = pengurus && pengurus.map((item) => ({
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
</script>

<div class="space-y-4">
	<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
		<BreadcrumbItem href="/dashboard" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem>List Debitor</BreadcrumbItem>
	</Breadcrumb>
	<div class="min-h-max overflow-hidden rounded-lg border border-gray-200 p-8 dark:border-gray-700">
		<div class="mb-4 flex flex-col items-start justify-between sm:mb-0 md:flex-row">
			<caption
				class="mb-2 bg-white text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white md:mb-5"
			>
				List Debitor
				<p class="mt-1 text-sm font-light text-gray-500 dark:text-gray-400">
					Kelola semua debitor.
				</p>
			</caption>
			{#if roleId === 1}
				<Button
					on:click={openCreateModal}
					class="flex h-fit w-full items-center justify-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
				>
					Tambah debitor
				</Button>
			{/if}
		</div>
		{#if debitor.length === 0}
			<div
				class="border-1 flex w-full items-center justify-center rounded-md border border-gray-300 py-40"
			>
				<h1 class="text-md font-medium text-gray-400 dark:text-white">
					List debitor masih kosong.
				</h1>
			</div>
		{:else}
			<Table divClass="mt-2 overflow-auto">
				<TableHead>
					<TableHeadCell>No</TableHeadCell>
					<TableHeadCell>Nama</TableHeadCell>
					<TableHeadCell>Uid</TableHeadCell>
					<TableHeadCell>Tanggal Sidang</TableHeadCell>
					<TableHeadCell>Tempat Sidang</TableHeadCell>
					{#if roleId === 1 || roleId === 2}
						<TableHeadCell>Aksi</TableHeadCell>
					{/if}
				</TableHead>
				<TableBody>
					{#each debitor as data, index (data)}
						<TableBodyRow>
							<TableBodyCell>{index + 1}</TableBodyCell>
							<TableBodyCell>{data.nama}</TableBodyCell>
							<TableBodyCell>{data.uid}</TableBodyCell>
							<TableBodyCell>{data.tglSidang}</TableBodyCell>
							<TableBodyCell>{data.tempatSidang}</TableBodyCell>
							{#if roleId === 1 || roleId === 2}
								<TableBodyCell>
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
								</TableBodyCell>
							{/if}
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
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
