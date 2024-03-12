<script>
	import { goto } from '$app/navigation';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	export let data;
	const { debitor } = data.body;
	onMount(() => {
		if (data.body.user) {
			if (data.body.user.roleId === 1 || data.body.user.roleId === 2) {
				goto('/dashboard', {
					replaceState: true
				});
			}
		}
	});
</script>

<div class="space-y-4">
	<h1 class="text-3xl font-bold tracking-tight text-gray-900">List Debitor PKPU</h1>
	<div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
		{#if debitor.length === 0}
			<div
				class="border-1 flex w-full items-center justify-center rounded-md border border-gray-300 py-40"
			>
				<h1 class="text-md font-medium text-gray-400 dark:text-white">
					List debitor masih kosong.
				</h1>
			</div>
		{:else}
			<Table>
				<TableHead>
					<TableHeadCell>No</TableHeadCell>
					<TableHeadCell>Nama</TableHeadCell>
					<TableHeadCell>Tanggal Sidang</TableHeadCell>
					<TableHeadCell>Tempat Sidang</TableHeadCell>
					<TableHeadCell>Link</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each debitor as data, index (data)}
						<TableBodyRow>
							<TableBodyCell>{index + 1}</TableBodyCell>
							<TableBodyCell>{data.nama}</TableBodyCell>
							<TableBodyCell>{data.tglSidang}</TableBodyCell>
							<TableBodyCell>{data.tempatSidang}</TableBodyCell>
							<TableBodyCell>
								<a
									data-sveltekit-reload
									href={`/${data.link}/tagihan`}
									class="font-medium text-primary-600 hover:underline dark:text-primary-500"
									>{data.nama}</a
								>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</div>
</div>
