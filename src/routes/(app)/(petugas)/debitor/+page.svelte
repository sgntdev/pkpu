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
		Modal
	} from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	export let data;
	const { token, roleId } = data.body;
	let debitor = data.body.debitor;
	let deleteModal = false;
	let deleteTargetId;
	const openDeleteModal = (id) => {
		deleteTargetId = id;
		deleteModal = true;
	};
	const handleDeletePassword = async () => {
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
				showToast(result.message, 'success')
				const updatedDataResponse = await fetch('/api/debitor', {
					method: 'GET'
				});
				const updatedData = await updatedDataResponse.json();
				debitor = updatedData;
			} else {
				showToast(result.message, 'error')
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
					data-sveltekit-reload
					href="/debitor/create"
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
					{#if roleId === 1}
						<TableHeadCell></TableHeadCell>
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
							{#if roleId === 1}
								<TableBodyCell>
									<Button data-sveltekit-reload on:click={() => copyText(data.nama)}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											class="h-5 w-5 shrink-0"
											role="img"
											aria-label="link outline"
											viewBox="0 0 24 24"
											><path
												stroke="currentColor"
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M13.2 9.8a3.4 3.4 0 0 0-4.8 0L5 13.2A3.4 3.4 0 0 0 9.8 18l.3-.3m-.3-4.5a3.4 3.4 0 0 0 4.8 0L18 9.8A3.4 3.4 0 0 0 13.2 5l-1 1"
											></path></svg
										>
									</Button>
									<Button data-sveltekit-reload href={`debitor/${data.id}`}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											class="h-5 w-5 shrink-0"
											role="img"
											aria-label="edit solid"
											viewBox="0 0 24 24"
											><path
												fill="currentColor"
												fill-rule="evenodd"
												d="M11.3 6.2H5a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h11c1.1 0 2-1 2-2.1V11l-4 4.2c-.3.3-.7.6-1.2.7l-2.7.6c-1.7.3-3.3-1.3-3-3.1l.6-2.9c.1-.5.4-1 .7-1.3l3-3.1Z"
												clip-rule="evenodd"
											></path><path
												fill="currentColor"
												fill-rule="evenodd"
												d="M19.8 4.3a2.1 2.1 0 0 0-1-1.1 2 2 0 0 0-2.2.4l-.6.6 2.9 3 .5-.6a2.1 2.1 0 0 0 .6-1.5c0-.2 0-.5-.2-.8Zm-2.4 4.4-2.8-3-4.8 5-.1.3-.7 3c0 .3.3.7.6.6l2.7-.6.3-.1 4.7-5Z"
												clip-rule="evenodd"
											></path></svg
										>
									</Button>
									<Button color="red" on:click={() => openDeleteModal(data.id)}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											class="h-5 w-5 shrink-0"
											role="img"
											aria-label="trash bin solid"
											viewBox="0 0 24 24"
											><path
												fill="currentColor"
												fill-rule="evenodd"
												d="M8.6 2.6A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4c0-.5.2-1 .6-1.4ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
												clip-rule="evenodd"
											></path></svg
										></Button
									></TableBodyCell
								>
							{/if}
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
			Anda yakin akan menghapus debitor ini?
		</h3>
		<Button color="red" class="me-2" on:click={handleDeletePassword}>Ya, Saya yakin</Button>
		<Button color="alternative">Tidak, batal</Button>
	</div>
</Modal>
