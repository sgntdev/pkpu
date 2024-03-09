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
		Badge,
		Indicator
	} from 'flowbite-svelte';
	import { EyeSolid } from 'flowbite-svelte-icons';
	export let data;
	const { tagihan, kreditor } = data.body;
	const formatPrice = (price) => {
		if (typeof price !== 'string') {
			price = price.toString();
		}
		const digits = price.replace(/,/g, '');
		const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return formatted;
	};
</script>

<div class="space-y-4">
	<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
		<BreadcrumbItem href="/dashboard" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem href="/kreditor">List Kreditor</BreadcrumbItem>
		<BreadcrumbItem>List Tagihan</BreadcrumbItem>
	</Breadcrumb>
	<div class="min-h-max overflow-hidden rounded-lg border border-gray-200 p-8 dark:border-gray-700">
		<div class="mb-4 flex flex-col items-start justify-between sm:mb-0 md:flex-row">
			<caption
				class="mb-2 bg-white text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white md:mb-5"
			>
				List Tagihan {kreditor.nama}
				<p class="mt-1 text-sm font-light text-gray-500 dark:text-gray-400">
					Kelola semua tagihan.
				</p>
			</caption>
		</div>
		{#if tagihan.length === 0}
			<div
				class="border-1 flex w-full items-center justify-center rounded-md border border-gray-300 py-40"
			>
				<h1 class="text-md font-medium text-gray-400 dark:text-white">
					List tagihan {kreditor.nama} masih kosong.
				</h1>
			</div>
		{:else}
			<Table divClass="mt-2 overflow-auto">
				<TableHead>
					<TableHeadCell>No</TableHeadCell>
					<TableHeadCell>Pertanggal</TableHeadCell>
					<TableHeadCell>Total Tagihan</TableHeadCell>
					<TableHeadCell>Sifat/Golongan Tagihan</TableHeadCell>
					<TableHeadCell>Jumlah Tagihan Seluruhnya</TableHeadCell>
					<TableHeadCell>Mulai Tertunggak</TableHeadCell>
					<TableHeadCell>Status</TableHeadCell>
					<TableHeadCell>Tagihan</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each tagihan as data, index (data)}
						<TableBodyRow>
							<TableBodyCell>{index + 1}</TableBodyCell>
							<TableBodyCell>{data.pertanggal}</TableBodyCell>
							<TableBodyCell>Rp. {formatPrice(data.totalTagihan)}</TableBodyCell>
							<TableBodyCell>{data.sifatTagihan}</TableBodyCell>
							<TableBodyCell>{data.jumlahTagihan}</TableBodyCell>
							<TableBodyCell>{data.kurunTunggakan}</TableBodyCell>
							<TableBodyCell>
								{#if data.statusTagihan === 0}
								<Badge color="gray" rounded class="px-2.5 py-0.5">
									<Indicator color="dark" size="xs" class="me-1" />Pending
								  </Badge>
								{:else if data.statusTagihan === 1}
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
									href={`/kreditor/${kreditor.id}/tagihan/${data.id}`}
									class="font-medium text-primary-600 hover:underline dark:text-primary-500"
									>Lihat Dokumen</a
								>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</div>
</div>
