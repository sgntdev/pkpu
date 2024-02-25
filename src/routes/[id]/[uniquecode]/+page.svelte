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
    const {uniquecode, tagihan} = data.body
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
	<div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg p-6 ">
        <div class="flex flex-row justify-between items-center">
            <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                List Tagihan
                <p class="mt-1 text-sm font-light text-gray-500 dark:text-gray-400">Kelola semua tagihan anda yang ada atau tambahkan tagihan baru.</p>
            </caption>
            <a href={`./${uniquecode}/tagihan`}
                    class="flex items-center h-fit justify-center px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
              Tambah tagihan
            </a>
        </div>
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
                {#each tagihan as data, index(data) }
				<TableBodyRow>
                    <TableBodyCell>{index+1}</TableBodyCell>
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
	</div>
</div>
