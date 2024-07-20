<script>
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Modal,
		Spinner,
		ButtonGroup
	} from 'flowbite-svelte';
	import {
		PlusSolid,
		DownloadSolid,
		EyeSolid
	} from 'flowbite-svelte-icons';
	import { showToast } from '$lib/toastStore';
	import { page } from '$app/stores';
	const tagihanId = $page.params.tagihanid;
	export let data;
	const { token, roleId, userId } = data.body;
	let tagihan = data.body.tagihan;
	//cek apakah user memiliki akses
	const hasAccess = tagihan.Debitor.pengurusAccess.includes(userId);
	//cek apakah user sudah melakukan voting
	$: hasVoted = tagihan.TagihanVote.some((item) => item.userId === userId);
	//memformat harga
	const formatPrice = (price) => {
		if (typeof price !== 'string') {
			price = price.toString();
		}
		const digits = price.replace(/,/g, '');
		const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return formatted;
	};
	let verifyModal = false;
	let loading = false;
	let verifyData = {
		tagihanStatus: '',
		password: ''
	};
	let form;
	let showPassword = false;
	$: type = showPassword ? 'text' : 'password';
	$: inputProperties = { type };

	const handleEntryPassword = async () => {
		loading = true;
		try {
			const response = await fetch(`/api/tagihan/${tagihanId}/verify`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ ...verifyData, userId })
			});
			const result = await response.json();
			if (result.success) {
				verifyModal = false;
				showToast(result.message, 'success');
				verifyData = {
					tagihanStatus: '',
					password: ''
				};
				tagihan = result.data;
			} else {
				form = result;
				if (!result.errors) {
					showToast(result.message, 'error');
				}
			}
		} finally {
			loading = false;
		}
	};

	async function downloadFile(url) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.download = 'Bukti tagihan';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(downloadUrl);
		} catch (error) {
			console.error('Error downloading the file:', error);
		}
	}
</script>

<div class="space-y-4">
	<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
		<BreadcrumbItem href="/dashboard" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem href="/tagihandetail">List Tagihan</BreadcrumbItem>
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
			{:else if tagihan.status === 2}
				<span
					class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300"
				>
					<span class="me-1 h-2 w-2 rounded-full bg-red-500"></span>
					Objection
				</span>
			{:else if tagihan.verifiedVote > tagihan.objectionVote}
				<span
					class="inline-flex h-max items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300"
				>
					<span class="me-1 h-2 w-2 rounded-full bg-green-500"></span>
					Pending {tagihan.verifiedVote} / {tagihan.totalVoters}
				</span>
			{:else if tagihan.objectionVote > tagihan.verifiedVote}
				<span
					class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300"
				>
					<span class="me-1 h-2 w-2 rounded-full bg-red-500"></span>
					Pending {tagihan.objectionVote} / {tagihan.totalVoters}
				</span>
			{:else}
				<span
					class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-900 dark:text-gray-300"
				>
					<span class="me-1 h-2 w-2 rounded-full bg-gray-900"></span>
					Pending
				</span>
			{/if}
		</div>
		<!-- Identitas Kreditor -->
		<div class="border-t-2 border-gray-100 py-3">
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
		<!-- Jumlah Tagihan -->
		<div class="border-t-2 border-gray-100 py-3">
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
		<!-- Sifat/Golongan Tagihan -->
		<div class="border-t-2 border-gray-100 py-3">
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
		<!-- Kurun Tunggakan -->
		<div class="border-t-2 border-gray-100 py-3">
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
		<!-- Daftar Bukti Tagihan -->
		<div class="border-t-2 border-gray-100 py-3">
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
								<Button href={item.dokumen_url} target="_blank">
									<EyeSolid class="me-2 h-3 w-3" />
									View
								</Button>
								<Button on:click={() => downloadFile(item.dokumen_url)}>
									<DownloadSolid class="me-2 h-3 w-3" />
									Download
								</Button>
							</ButtonGroup>
						</div>
					{/each}
				{/if}
			</div>
		</div>
		<!-- Voted by -->
		<div class="border-t-2 border-gray-100 py-3">
			<h2 class="mb-4 text-2xl font-bold capitalize tracking-tight text-gray-900 dark:text-white">
				Voted by
			</h2>
			<div class="grid gap-4 md:px-4">
				{#if tagihan.TagihanVote.length > 0}
					{#each tagihan.TagihanVote as item, index}
						<div class="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
							<p class="text-md font-normal tracking-tight text-gray-900 dark:text-white">
								{index + 1}. {item.User.email}
							</p>
							{#if item.vote === 1}
								<svg
									class="h-3 w-3 text-green-500"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
									/>
								</svg>
							{:else}
								<svg
									class="h-3 w-3 text-red-500"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="currentColor"
									viewBox="0 0 20 20"
								>
									<path
										d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
									/>
								</svg>
							{/if}
						</div>
					{/each}
				{:else}
					<p class="text-md font-normal tracking-tight text-gray-400 dark:text-white">
						Vote masih kosong.
					</p>
				{/if}
			</div>
		</div>
		{#if (roleId === 1 || roleId === 2) && !hasVoted && hasAccess}
			<div class="flex justify-end">
				<Button on:click={() => (verifyModal = true)}>Verify</Button>
			</div>
		{/if}
	</div>
</div>

<Modal
	bind:open={verifyModal}
	size="xs"
	autoclose={false}
	class="w-full"
	backdropClass="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
>
	<form
		method="POST"
		class="flex flex-col space-y-4"
		on:submit|preventDefault={handleEntryPassword}
	>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Password Verifikasi Tagihan</h3>

		<label
			for="tagihanStatus"
			class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'tagihanStatus') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
		>
			<span>Status Tagihan</span>
			<select
				id="tagihanStatus"
				name="tagihanStatus"
				bind:value={verifyData.tagihanStatus}
				class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'tagihanStatus') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
			>
				<option value="" selected disabled>Pilih Status Tagihan</option>
				<option value="1">Verified</option>
				<option value="0">Objection</option>
			</select>
			{#if form?.errors?.find((error) => error.field === 'tagihanStatus')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'tagihanStatus').message}
				</p>
			{/if}
		</label>
		<label
			for="password"
			class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'password') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
		>
			<span>Password</span>
			<input
				{...inputProperties}
				bind:value={verifyData.password}
				id="password"
				name="password"
				placeholder="•••••••••"
				class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'password') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
			/>
			{#if form?.errors?.find((error) => error.field === 'password')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'password').message}
				</p>
			{/if}
		</label>

		<Button type="submit">
			{#if loading}
				<Spinner class="me-2" size="4" color="white" />
			{:else}
				Vote Tagihan
			{/if}
		</Button>
	</form>
</Modal>
