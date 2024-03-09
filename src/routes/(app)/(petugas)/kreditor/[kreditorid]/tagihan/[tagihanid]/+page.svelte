<script>
	import { Breadcrumb, BreadcrumbItem, Button, Modal, Spinner, Toast } from 'flowbite-svelte';
	import { PlusSolid, CheckCircleSolid, CloseSolid } from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';
	export let data;
	const { tagihanId, dokumen, token, roleId } = data.body;
	let tagihan = data.body.tagihan
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
	const handleEntryPassword = async () => {
		loading = true;
		try {
			const response = await fetch(`/api/tagihan/${tagihanId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(verifyData)
			});
			const result = await response.json();
			console.log(result);
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
				const updatedDataResponse = await fetch(`/api/tagihan/${tagihanId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const updatedData = await updatedDataResponse.json();
				tagihan = updatedData;
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
		} catch (error) {
			console.error('err', error);
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
					<CloseSolid class="h-5 w-5" />
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
		<div>
			<h2 class="mb-4 text-2xl font-bold capitalize tracking-tight text-gray-900 dark:text-white">
				identitas kreditor
			</h2>
			<div class="grid gap-2 md:px-4">
				<div class="grid grid-cols-2 items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							nama
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							{tagihan.kreditor.nama}
						</p>
					</div>
				</div>
				<div class="grid grid-cols-2 items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p class="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">alamat</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							{tagihan.kreditor.alamat}
						</p>
					</div>
				</div>
				<div class="grid grid-cols-2 items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							no. telepon
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							{tagihan.kreditor.noTelp}
						</p>
					</div>
				</div>
				<div class="grid grid-cols-2 items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							email
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal tracking-tight text-gray-900 dark:text-white">
							{tagihan.kreditor.email}
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
					class="ms-14 flex max-w-60 flex-row items-center justify-center gap-2 md:ms-48 md:max-w-80"
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
							Rp. {formatPrice(tagihan.totalTagihan)}
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
				<div class="grid grid-cols-2 items-center lg:grid-cols-7">
					<div class="lg:col-span-2">
						<p
							class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white"
						>
							sifat/golongan tagihan
						</p>
					</div>
					<div class="lg:col-span-5">
						<p class="text-md font-normal capitalize tracking-tight text-gray-900 dark:text-white">
							{tagihan.sifatTagihan}
						</p>
					</div>
				</div>
				<div class="grid grid-cols-2 items-center lg:grid-cols-7">
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
				<div class="grid grid-cols-2 items-center lg:grid-cols-7">
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
				<div class="grid grid-cols-2 items-center lg:grid-cols-7">
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
		<div class="relative">
			<h2 class="mb-4 text-2xl font-bold capitalize tracking-tight text-gray-900 dark:text-white">
				daftar bukti tagihan
			</h2>
			<div class="grid gap-2 md:px-4">
				{#each dokumen as item, index}
					<p class="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-white">
						{index + 1}. {item.tipeDokumen}
					</p>
					<iframe
						src={`/doc/${item.namaDokumen}`}
						class="mb-2 mt-4 max-h-64 w-full rounded-lg border-2 border-gray-300"
						width="600"
						height="400"
						frameborder="0"
						title="s"
					/>
				{/each}
			</div>
			<div class="absolute -bottom-6 -right-8 -rotate-12 opacity-50">
				{#if tagihan.statusTagihan === 1}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-40 w-40 text-green-500"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
						/>
					</svg>
				{/if}
				{#if tagihan.statusTagihan === 2}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-40 w-40 text-red-500"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
						/>
					</svg>
				{/if}
			</div>
		</div>
		{#if roleId === 1}
			{#if tagihan.statusTagihan === 0}
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
				<option value="2">Objection</option>
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
				type="text"
				bind:value={verifyData.password}
				id="password"
				name="password"
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
				Enter password
			{/if}
		</Button>
	</form>
</Modal>
