<script>
	import { Breadcrumb, BreadcrumbItem, Button, ButtonGroup } from 'flowbite-svelte';
	import { PlusSolid, DownloadSolid, EyeSolid } from 'flowbite-svelte-icons';
	export let data;
	const { tagihan } = data.body;
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
		<BreadcrumbItem href="/tagihan" home>List Tagihan</BreadcrumbItem>
		<BreadcrumbItem>Tagihan</BreadcrumbItem>
	</Breadcrumb>
	<div
		class="flex min-h-max flex-col gap-4 overflow-hidden rounded-lg border border-gray-200 p-8 dark:border-gray-700"
	>
		<div class="flex items-center justify-between">
			<h2 class="text-3xl font-bold capitalize tracking-tight text-gray-900 dark:text-white">
				tagihan
			</h2>
			{#if tagihan.status === 1}
				<span
					class="inline-flex h-max items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300"
				>
					<span class="me-1 h-2 w-2 rounded-full bg-green-500"></span>
					Verified
				</span>
			{/if}
			{#if tagihan.status === 2}
				<span
					class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300"
				>
					<span class="me-1 h-2 w-2 rounded-full bg-red-500"></span>
					Objection
				</span>
			{/if}
		</div>
		<div>
			<h2 class="mb-4 text-2xl font-bold capitalize tracking-tight text-gray-900 dark:text-white">
				identitas kreditor
			</h2>
			<div class="grid gap-2 md:px-4">
				<div class="grid-rows grid items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							nama
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							{tagihan.Kreditor.nama}
						</p>
					</div>
				</div>
				<div class="grid-rows grid items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							alamat
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							{tagihan.Kreditor.alamat}
						</p>
					</div>
				</div>
				<div class="grid-rows grid items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							no. telepon
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							{tagihan.Kreditor.noTelp}
						</p>
					</div>
				</div>
				<div class="grid-rows grid items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							email
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal tracking-tight text-gray-900 dark:text-white">
							{tagihan.Kreditor.email}
						</p>
					</div>
				</div>
			</div>
		</div>
		<div>
			<h2 class="mb-4 text-2xl font-bold capitalize tracking-tight text-gray-900 dark:text-white">
				jumlah tagihan
			</h2>
			<div class="grid gap-2 md:px-4">
				<div class="grid grid-cols-2 items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							Pertanggal
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							{tagihan.pertanggal}
						</p>
					</div>
				</div>
				<div class="grid grid-cols-2 items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							hutang pokok
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							Rp. {formatPrice(tagihan.hutangPokok)}
						</p>
					</div>
				</div>
				<div class="grid grid-cols-2 items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							bunga
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							Rp. {formatPrice(tagihan.bunga)}
						</p>
					</div>
				</div>
				<div class="grid grid-cols-2 items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							denda
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							Rp. {formatPrice(tagihan.denda)}
						</p>
					</div>
				</div>
				<div
					class="ms-32 flex max-w-60 flex-row items-center justify-center gap-2 md:ms-72 md:max-w-80"
				>
					<div class="flex h-0.5 w-full border-t-2 border-dashed border-gray-900" />
					<PlusSolid />
				</div>
				<div class="grid grid-cols-2 items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							total
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-bold capitalize tracking-tight text-gray-900 dark:text-white">
							Rp. {formatPrice(
								parseFloat(tagihan.hutangPokok) +
									parseFloat(tagihan.denda) +
									parseFloat(tagihan.bunga)
							)}
						</p>
					</div>
				</div>
			</div>
		</div>
		<div>
			<h2 class="mb-4 text-2xl font-bold capitalize tracking-tight text-gray-900 dark:text-white">
				sifat/golongan tagihan
			</h2>
			<div class="grid gap-2 md:px-4">
				<div class="grid-rows grid items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							sifat/golongan tagihan
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							{tagihan.SifatTagihan.sifat}
						</p>
					</div>
				</div>
				<div class="grid-rows grid items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							jumlah tagihan seluruhnya
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							{tagihan.jumlahTagihan}
						</p>
					</div>
				</div>
			</div>
		</div>
		<div>
			<h2 class="mb-4 text-2xl font-bold capitalize tracking-tight text-gray-900 dark:text-white">
				kurun tunggakan
			</h2>
			<div class="grid gap-2 md:px-4">
				<div class="grid-rows grid items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							mulai tertunggak sejak
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							{tagihan.mulaiTertunggak}
						</p>
					</div>
				</div>
				<div class="grid-rows grid items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							jumlah hari tunggakan
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							{tagihan.jumlahHari} Hari
						</p>
					</div>
				</div>
			</div>
		</div>
		<div>
			<h2 class="mb-4 text-2xl font-bold capitalize tracking-tight text-gray-900 dark:text-white">
				daftar bukti tagihan
			</h2>
			<div class="grid gap-4 md:px-4">
				{#if !tagihan.DokumenTagihan.length > 0}
					<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
						Dokumen Bukti Tagihan Tidak Ditemukan.
					</p>
				{:else}
					{#each tagihan.DokumenTagihan as item, index}
						<div
							class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-0"
						>
							<p
								class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
							>
								{index + 1}. {item.TipeDokumen.tipe}
							</p>
							<ButtonGroup>
								<Button href={item.dokumen_url}>
									<EyeSolid class="me-2 h-3 w-3" />
									View
								</Button>
								<Button download href={item.dokumen_url}>
									<DownloadSolid class="me-2 h-3 w-3" />
									Download
								</Button>
							</ButtonGroup>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
