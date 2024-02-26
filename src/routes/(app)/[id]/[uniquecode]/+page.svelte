<script>
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	export let data;
	const { uniquecode, tagihan } = data.body;
	const formatPrice = (price) => {
		if (typeof price !== 'string') {
			price = price.toString();
		}
		const digits = price.replace(/,/g, '');
		const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return formatted;
	};
</script>

<main class="md:min-h-screen py-4 md:py-10">
<div class="space-y-4">
	<div class="overflow-hidden border border-gray-200 p-8 dark:border-gray-700 rounded-lg min-h-max">
		<div class="flex flex-row items-start justify-between">
			<caption
				class="bg-white mb-5 text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white"
			>
				List Tagihan
				<p class="mt-1 text-sm font-light text-gray-500 dark:text-gray-400">
					Kelola semua tagihan anda yang ada atau tambahkan tagihan baru.
				</p>
			</caption>
			<a
				href={`./${uniquecode}/tagihan`}
				class="flex h-fit items-center justify-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
			>
				Tambah tagihan
			</a>
		</div>
		{#if tagihan.length === 0}
		<div class="flex justify-center w-full items-center py-40 border border-1 border-gray-300 rounded-md">
			<h1 class="text-md text-gray-400 dark:text-white font-medium ">List tagihan masih kosong.</h1>
		</div>
		{:else}
		<Table striped divClass="mt-2">
			<TableHead>
				<TableHeadCell>No</TableHeadCell>
				<TableHeadCell>Kreditor</TableHeadCell>
				<TableHeadCell>Pertanggal</TableHeadCell>
				<TableHeadCell>Total Tagihan</TableHeadCell>
				<TableHeadCell>Sifat/Golongan Tagihan</TableHeadCell>
				<TableHeadCell>Jumlah Tagihan Seluruhnya</TableHeadCell>
				<TableHeadCell>Kurun Tunggakan</TableHeadCell>
			</TableHead>
			<TableBody>
					{#each tagihan as data, index (data)}
						<TableBodyRow>
							<TableBodyCell>{index + 1}</TableBodyCell>
							<TableBodyCell>{data.kreditor}</TableBodyCell>
							<TableBodyCell>{data.pertanggal}</TableBodyCell>
							<TableBodyCell>Rp. {formatPrice(data.totalTagihan)}</TableBodyCell>
							<TableBodyCell>{data.sifatTagihan}</TableBodyCell>
							<TableBodyCell>{data.jumlahTagihan}</TableBodyCell>
							<TableBodyCell>{data.kurunTunggakan}</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
			{/if}
	</div>
</div>
</main>
