<script>
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Checkbox,
		TableSearch
	} from 'flowbite-svelte';
</script>

<div class="">
	<div class="mx-auto py-6 ">
		<h1 class="text-3xl font-bold tracking-tight text-gray-900">List Debitur PKPU</h1>
	  </div>
	<div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
		<Table>
			<TableHead>
				<TableHeadCell>No</TableHeadCell>
				<TableHeadCell>Nama</TableHeadCell>
				<TableHeadCell>Tanggal Sidang</TableHeadCell>
				<TableHeadCell>Tempat Sidang</TableHeadCell>
				<TableHeadCell>Link</TableHeadCell>
			</TableHead>
			<TableBody class="divide-y">
				<TableBodyRow>
					<TableBodyCell>1</TableBodyCell>
					<TableBodyCell>PT ABC</TableBodyCell>
					<TableBodyCell>4 Januari 2024</TableBodyCell>
					<TableBodyCell>Jakarta</TableBodyCell>
					<TableBodyCell>
						<a
							href="/pt-abc"
							class="font-medium text-primary-600 hover:underline dark:text-primary-500">PT ABC</a
						>
					</TableBodyCell>
				</TableBodyRow>
			</TableBody>
		</Table>
	</div>
</div>
