<script>
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Breadcrumb,
		BreadcrumbItem,
		Button
	} from 'flowbite-svelte';
	import { TrashBinSolid } from 'flowbite-svelte-icons';
	export let data;
	let debitor = data.body.debitor;
	let formModal = false
	// const handleRemoveTagihan = async (id) => {
	// 	try {
	// 		const response = await fetch(`/api/kreditor/${id}`, {
	// 			method: 'DELETE'
	// 		});
	// 		const result = await response.json();
	// 		if (response.ok) {
	// 			console.log(result.message);
	// 			const updatedDataResponse = await fetch('/api/kreditor');
	// 			const updatedData = await updatedDataResponse.json();
	// 			kreditorData = updatedData;
	// 		} else {
	// 			console.error(`HTTP error! Status: ${response.status}`);
	// 		}
	// 	} catch (error) {
	// 		console.error('Error:', error);
	// 	}
	// };
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
			{#if data.body.roleId === 1}
				<Button
					on:click={() => (formModal = true)}
					class="flex h-fit w-full items-center justify-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
				>
					Tambah user
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
					<TableHeadCell>Tanggal Sidang</TableHeadCell>
					<TableHeadCell>Tempat Sidang</TableHeadCell>
					<!-- <TableHeadCell>List Tagihan</TableHeadCell>  -->
					<!-- <TableHeadCell></TableHeadCell> -->
				</TableHead>
				<TableBody>
					{#each debitor as data, index (data)}
						<TableBodyRow>
							<TableBodyCell>{index + 1}</TableBodyCell>
							<TableBodyCell>{data.nama}</TableBodyCell>
							<TableBodyCell>{data.tglSidang}</TableBodyCell>
							<TableBodyCell>{data.tempatSidang}</TableBodyCell>
							<!-- <TableBodyCell>
								<a href={`/${id}/${uniqueCode}/kreditor/${data.id}`} class="font-medium text-primary-600 hover:underline dark:text-primary-500">{data.nama}</a>
							</TableBodyCell> -->
							<!-- <TableBodyCell>
								<Button color="red" on:click={() => handleRemoveTagihan(data.id)}
									><TrashBinSolid /></Button
								>
							</TableBodyCell> -->
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</div>
</div>
