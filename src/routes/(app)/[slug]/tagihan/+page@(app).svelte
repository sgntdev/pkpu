<script>
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Toast,
		Breadcrumb,
		BreadcrumbItem,
		Badge,
		Indicator
	} from 'flowbite-svelte';
	export let data;
	import { page } from '$app/stores';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	const { tagihan, link } = data?.body;
	let showToast = false;
	onMount(() => {
		if ($page.state.statusSuccess) {
			showToast = true;
			setTimeout(() => {
				showToast = false;
			}, 2000);
		}
	});
	const formatPrice = (price) => {
		if (typeof price !== 'string') {
			price = price?.toString();
		}
		const digits = price.replace(/,/g, '');
		const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return formatted;
	};
</script>

{#if showToast}
	<div transition:fly={{ x: 200 }} class="absolute end-5 top-20">
		<Toast color="green" class="z-50 mb-4">
			<svelte:fragment slot="icon">
				<CheckCircleSolid class="h-5 w-5" />
				<span class="sr-only">Check icon</span>
			</svelte:fragment>
			{$page.state.message}
		</Toast>
	</div>
{/if}

<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
	<BreadcrumbItem href="/" home>List Debitor</BreadcrumbItem>
	<BreadcrumbItem>List Tagihan</BreadcrumbItem>
</Breadcrumb>
<div class="space-y-4">
	<div class="min-h-max overflow-hidden rounded-lg border border-gray-200 p-8 dark:border-gray-700">
		<div class="mb-4 flex flex-col items-start justify-between sm:mb-0 md:flex-row">
			<div class="mb-2 md:mb-5">
				<p class="text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
					List Tagihan
				</p>
				<p class="mt-1 text-sm font-light text-gray-500 dark:text-gray-400">
					Kelola semua tagihan anda yang ada atau tambahkan tagihan baru.
				</p>
			</div>
			<a
				data-sveltekit-reload
				href="./tagihan/create"
				class="flex h-fit w-full items-center justify-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
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
									href={`/${link}/tagihan/${data.id}`}
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
