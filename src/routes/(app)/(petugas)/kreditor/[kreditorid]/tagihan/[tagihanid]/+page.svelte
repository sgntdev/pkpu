<script>
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Modal,
		Spinner,
		Toast,
		ButtonGroup
	} from 'flowbite-svelte';
	import {
		PlusSolid,
		CheckCircleSolid,
		XCircleSolid,
		DownloadSolid,
		EyeSolid
	} from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';
	import { page } from '$app/stores';
	const tagihanId = $page.params.tagihanid;
	export let data;
	const { token, roleId, userId } = data.body;
	let tagihan = data.body.tagihan;
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
	let showToast = false;
	let toastData;
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
				showToast = true;
				toastData = {
					success: true,
					message: result.message
				};
				setTimeout(() => {
					showToast = false;
					clearToastData();
				}, 2000);
				verifyData = {
					tagihanStatus: '',
					password: ''
				};
				tagihan = result.data;
			} else {
				form = result;
				if (!result.errors) {
					toastData = {
						success: false,
						message: result.message
					};
					showToast = true;
					setTimeout(() => {
						showToast = false;
						clearToastData();
					}, 2000);
				}
			}
		} finally {
			loading = false;
		}
	};
	const clearToastData = () => {
		toastData = null;
	};
</script>

{#if showToast}
	<div transition:fly={{ x: 200 }} class="top-15 fixed end-5 z-[60]">
		<Toast color={toastData?.success ? 'green' : 'red'} class="mb-4">
			<svelte:fragment slot="icon">
				{#if toastData?.success}
					<CheckCircleSolid class="h-5 w-5" />
					<span class="sr-only">Check icon</span>
				{:else}
					<XCircleSolid class="h-5 w-5" />
					<span class="sr-only">Error icon</span>
				{/if}
			</svelte:fragment>
			{toastData?.message}
		</Toast>
	</div>
{/if}

<div class="space-y-4">
	<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
		<BreadcrumbItem href="/dashboard" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem href="/kreditor">List Kreditor</BreadcrumbItem>
		<BreadcrumbItem href="./">List Tagihan</BreadcrumbItem>
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
		{#if roleId === 1}
			{#if tagihan.TagihanVote.length === 0}
				<div class="flex justify-end">
					<Button on:click={() => (verifyModal = true)}>Verify</Button>
				</div>
			{/if}
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
				placeholder = '•••••••••'
				class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'password') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
			/>
			{#if form?.errors?.find((error) => error.field === 'password')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'password').message}
				</p>
			{/if}
		</label>
		<div class="mb-5 flex items-start">
			<div class="flex h-5 items-center">
				<input
					id="showPassword"
					bind:checked={showPassword}
					type="checkbox"
					class="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
				/>
			</div>
			<label for="showPassword" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
				>Show password</label
			>
		</div>

		<Button type="submit">
			{#if loading}
				<Spinner class="me-2" size="4" color="white" />
			{:else}
				Enter password
			{/if}
		</Button>
	</form>
</Modal>
