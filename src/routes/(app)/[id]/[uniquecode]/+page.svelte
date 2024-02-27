<script>
	import { page } from '$app/stores';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Toast
	} from 'flowbite-svelte';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
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

	let showToast = false;

	onMount(() => {
		if ($page.state.success) {
			showToast = true;
			setTimeout(() => {
				showToast = false;
			}, 2000);
		}
	});
</script>

{#if showToast}
	<div transition:fly={{ x: 200 }} class="absolute -end-16 top-3">
		<Toast color="green" class="z-50 mb-4">
			<svelte:fragment slot="icon">
				<CheckCircleSolid class="h-5 w-5" />
				<span class="sr-only">Check icon</span>
			</svelte:fragment>
			{$page.state.message}
		</Toast>
	</div>
{/if}
<main class="py-4 md:min-h-screen md:py-10">
	<div class="space-y-4">
		<div
			class="min-h-max overflow-hidden rounded-lg border border-gray-200 p-8 dark:border-gray-700"
		>
			<div class="flex flex-row items-start justify-between">
				<caption
					class="mb-5 bg-white text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white"
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
				<div
					class="border-1 flex w-full items-center justify-center rounded-md border border-gray-300 py-40"
				>
					<h1 class="text-md font-medium text-gray-400 dark:text-white">
						List tagihan masih kosong.
					</h1>
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
