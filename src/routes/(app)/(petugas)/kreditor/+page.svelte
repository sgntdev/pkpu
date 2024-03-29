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
		Button,
		Dropdown,
		Checkbox,
		Search
	} from 'flowbite-svelte';
	import { FilterOutline } from 'flowbite-svelte-icons';
	export let data;
	let debitorData = data.body.debitorData;
	let kreditorData = data.body.kreditorData;
	let group = [];
	$: tagihanByDebitor =
		group.length > 0 ? kreditorData.filter((item) => group.includes(item.debitorId)) : kreditorData;
	let searchDebitor = '';
	$: filterDebitors = debitorData.filter((debitor) =>
		debitor.nama.toLowerCase().includes(searchDebitor.toLowerCase())
	);
</script>

<div class="space-y-4">
	<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
		<BreadcrumbItem href="/dashboard" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem>List Kreditor</BreadcrumbItem>
	</Breadcrumb>
	<div class="min-h-max overflow-hidden rounded-lg border border-gray-200 p-8 dark:border-gray-700">
		<div class="mb-4 flex flex-col items-start justify-between sm:mb-0 md:flex-row">
			<caption
				class="mb-2 bg-white text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white md:mb-5"
			>
				List Kreditor
				<p class="mt-1 text-sm font-light text-gray-500 dark:text-gray-400">
					Kelola semua kreditor.
				</p>
			</caption>
			<Button color="light" class="h-fit w-full md:w-fit"
				>Filter<FilterOutline class="ms-2 h-4 w-4 text-gray-900" /></Button
			>
			<Dropdown placement="bottom" class="max-h-44 min-h-5 overflow-y-auto px-3 pb-3 text-sm">
				<div slot="header" class="p-3">
					<Search size="md" bind:value={searchDebitor} />
				</div>
				{#each filterDebitors as { id, nama}}
					<li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
						<Checkbox bind:group value={id}>{nama}</Checkbox>
					</li>
				{/each}
				<div slot="footer" class="px-3 py-1">
					<Button size="xs" color="light" on:click={() => (group.length = 0)}>Reset</Button>
				</div>
			</Dropdown>
		</div>
		{#if kreditorData.length === 0}
			<div
				class="border-1 flex w-full items-center justify-center rounded-md border border-gray-300 py-40"
			>
				<h1 class="text-md font-medium text-gray-400 dark:text-white">
					List kreditor masih kosong.
				</h1>
			</div>
		{:else}
			<Table divClass="mt-2 overflow-auto">
				<TableHead>
					<TableHeadCell>No</TableHeadCell>
					<TableHeadCell>User</TableHeadCell>
					<TableHeadCell>Nama kreditor</TableHeadCell>
					<TableHeadCell>Email</TableHeadCell>
					<TableHeadCell>No Telepon</TableHeadCell>
					<TableHeadCell>Alamat</TableHeadCell>
					<TableHeadCell>List Tagihan</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each tagihanByDebitor as data, index (data)}
						<TableBodyRow>
							<TableBodyCell>{index + 1}</TableBodyCell>
							<TableBodyCell>{data.userEmail}</TableBodyCell>
							<TableBodyCell>{data.nama}</TableBodyCell>
							<TableBodyCell>{data.email}</TableBodyCell>
							<TableBodyCell>{data.noTelp}</TableBodyCell>
							<TableBodyCell>{data.alamat}</TableBodyCell>
							<TableBodyCell>
								<a
									href={`/kreditor/${data.id}/tagihan`}
									class="font-medium text-primary-600 hover:underline dark:text-primary-500"
									>Lihat Tagihan</a
								>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</div>
</div>
