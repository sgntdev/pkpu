<script>
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Modal,
		Breadcrumb,
		BreadcrumbItem,
		Badge,
		Indicator,
		Spinner,
		Button
	} from 'flowbite-svelte';
	export let data;
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
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
				const updateDataRes = await fetch(
					`/api/debitor/${debitor.id}/tagihan?userId=${user.id}`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`
						}
					}
				);
				const updatedData = await updateDataRes.json();
				console.log(updatedData);
				tagihan = updatedData.data;
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
	const formatPrice = (price) => {
		if (typeof price !== 'string') {
			price = price?.toString();
		}
		const digits = price.replace(/,/g, '');
		const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return formatted;
	};
</script>

<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
	<BreadcrumbItem href="/" home>List Tagihan</BreadcrumbItem>
</Breadcrumb>
<div class="space-y-4">
	<div class="min-h-max overflow-hidden rounded-lg border border-gray-200 p-8 dark:border-gray-700">
		<div class="mb-4 flex flex-col items-start justify-between sm:mb-0 md:flex-row">
			<div class="mb-2 md:mb-5">
				<p class="text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
					List Tagihan {debitor.nama}
				</p>
				<p class="mt-1 text-sm font-light text-gray-500 dark:text-gray-400">
					Kelola semua tagihan anda yang ada atau tambahkan tagihan baru.
				</p>
			</div>
			<a
				href="tagihan/create"
				class="flex h-fit w-full items-center justify-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
			>
				Tambah tagihan
			</a>
		</div>
		{#if loading}
			<Spinner color="blue" size={8} />
		{/if}
		{#if !tagihan.length > 0}
			<div
				class="border-1 flex w-full items-center justify-center rounded-md border border-gray-300 py-40"
			>
				<h1 class="text-md font-medium text-gray-400 dark:text-white">
					List tagihan masih kosong.
				</h1>
			</div>
		{:else}
			<Table striped divClass="mt-2 overflow-auto">
				<TableHead>
					<TableHeadCell>No</TableHeadCell>
					<TableHeadCell>Kreditor</TableHeadCell>
					<TableHeadCell>Pertanggal</TableHeadCell>
					<TableHeadCell>Total Tagihan</TableHeadCell>
					<TableHeadCell>Sifat/Golongan Tagihan</TableHeadCell>
					<TableHeadCell>Jumlah Tagihan Seluruhnya</TableHeadCell>
					<TableHeadCell>Mulai Tertunggak</TableHeadCell>
					<TableHeadCell>Status</TableHeadCell>
					<TableHeadCell>Tagihan</TableHeadCell>
					<TableHeadCell>Aksi</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each tagihan as data, index (data)}
						<TableBodyRow>
							<TableBodyCell>{index + 1}</TableBodyCell>
							<TableBodyCell>{data.Kreditor.nama}</TableBodyCell>
							<TableBodyCell>{data.pertanggal}</TableBodyCell>
							<TableBodyCell
								>Rp. {formatPrice(
									parseFloat(data.denda) + parseFloat(data.hutangPokok) + parseFloat(data.bunga)
								)}</TableBodyCell
							>
							<TableBodyCell>{data.SifatTagihan.sifat}</TableBodyCell>
							<TableBodyCell>{data.jumlahTagihan}</TableBodyCell>
							<TableBodyCell>{data.mulaiTertunggak}</TableBodyCell>
							<TableBodyCell>
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
							</TableBodyCell>
							<TableBodyCell>
								<a
									href={`/tagihan/${data.id}`}
									class="font-medium text-primary-600 hover:underline dark:text-primary-500"
									>Lihat Dokumen</a
								>
							</TableBodyCell>
							<TableBodyCell>
								<div class="inline-flex rounded-md shadow-sm" role="group">
									<a
										href={`/tagihan/edit/${data.id}`}
										class="inline-flex items-center rounded-s-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:focus:text-white dark:focus:ring-blue-500"
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
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</div>
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
