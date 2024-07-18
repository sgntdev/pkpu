<script>
	import {
		Card,
		Button,
		Select,
		Modal,
		Spinner,
		Breadcrumb,
		BreadcrumbItem,
		Fileupload,
		Helper
	} from 'flowbite-svelte';
	import { PlusSolid, MinusSolid, CloseSolid } from 'flowbite-svelte-icons';
	import DatePicker from '../../../../lib/components/DatePicker.svelte';
	import { format } from 'date-fns';
	import { showToast } from '$lib/toastStore';
	import { goto } from '$app/navigation';
	export let data;
	const { token, debitorId, userId, sifatTagihanData, tipeDokumenData, totalVoters } = data.body;
	let kreditorData = data.body.kreditorData;
	let buktiTagihan = [
		{
			tipeDokumenId: '',
			dokumen: ''
		}
	];
	let formModal = false;
	let editModal = false;
	let editTargetId;
	let loading = false;
	let submitted = false;
	let form;
	let selectedKreditor = '';
	let searchKreditor = '';
	let value = [];

	$: filteredKreditors = kreditorData.filter((kreditor) =>
		kreditor.nama.toLowerCase().includes(searchKreditor.toLowerCase())
	);
	const handleSelectKreditor = (kreditorId) => {
		selectedKreditor = kreditorId;
		searchKreditor = '';
	};
	$: selectedKreditorData = kreditorData.find((kreditor) => kreditor.id === selectedKreditor);
	let jumlahTagihan = {
		pertanggal: null,
		hutangPokok: '',
		bunga: '',
		denda: '',
		totalTagihan: ''
	};
	$: jumlahTagihan.totalTagihan = formatPrice(
		parseFloat(unformatPrice(jumlahTagihan.hutangPokok) || 0) +
			parseFloat(unformatPrice(jumlahTagihan.denda) || 0) +
			parseFloat(unformatPrice(jumlahTagihan.bunga) || 0)
	);
	let sifatTagihan = {
		id: '',
		jumlahTagihan: ''
	};
	let kurunTunggakan = {
		mulaiTertunggak: null,
		jumlahHari: ''
	};

	//inputan dinamis
	const handleAddTagihan = () => {
		buktiTagihan = [...buktiTagihan, { tipeDokumenId: '', dokumen: null }];
	};

	const handleRemoveTagihan = (index) => {
		const list = [...buktiTagihan];
		list.splice(index, 1);
		buktiTagihan = list;
	};

	//add kreditor form
	let kreditor = {
		userId,
		nama: '',
		email: '',
		noTelp: '',
		alamat: ''
	};
	const handleAddKreditor = async () => {
		loading = true;
		try {
			const response = await fetch('/api/kreditor', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(kreditor)
			});
			const result = await response.json();
			form = result;
			if (result.success) {
				formModal = false;
				showToast(result.message, 'success');
				kreditor = {
					userId,
					nama: '',
					email: '',
					noTelp: '',
					alamat: ''
				};
				const updatedDataResponse = await fetch(`/api/kreditor?userId=${userId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const updatedData = await updatedDataResponse.json();
				kreditorData = updatedData.data;
			} else {
				showToast(result.message, 'error');
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading = false;
		}
	};
	const handleEditKreditor = async () => {
		loading = true;
		try {
			const response = await fetch(`/api/kreditor/${editTargetId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(kreditor)
			});
			const result = await response.json();
			form = result;
			if (result.success) {
				editModal = false;
				kreditor = {
					userId,
					nama: '',
					email: '',
					noTelp: '',
					alamat: ''
				};
				showToast(result.message, 'success');
				const updatedDataResponse = await fetch(`/api/kreditor?userId=${userId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const updatedData = await updatedDataResponse.json();
				kreditorData = updatedData.data;
			} else {
				showToast(result.message, 'error');
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading = false;
		}
	};
	const openAddModal = () => {
		formModal = true;
		kreditor = {
			userId,
			nama: '',
			email: '',
			noTelp: '',
			alamat: ''
		};
	};
	const openEditModal = (id, nama, email, noTelp, alamat) => {
		editTargetId = id;
		editModal = true;
		kreditor = {
			userId,
			nama,
			email,
			noTelp,
			alamat
		};
	};
	//
	const formatDate = (date) => (date ? format(new Date(date), 'dd MMMM yyyy') : '');

	$: jumlahTagihan.pertanggal = formatDate(jumlahTagihan.pertanggal);
	$: kurunTunggakan.mulaiTertunggak = formatDate(kurunTunggakan.mulaiTertunggak);

	const calculateDay = () => {
		let pertanggalDate = new Date(jumlahTagihan.pertanggal);
		let mulaiTertunggakDate = new Date(kurunTunggakan.mulaiTertunggak);
		const timeDifference = pertanggalDate - mulaiTertunggakDate;
		let daysDifference = timeDifference / (1000 * 3600 * 24);
		kurunTunggakan.jumlahHari = daysDifference || 0;
	};

	const handleSubmit = async (event) => {
		loading = true;
		submitted = true;
		const formData = new FormData(event.currentTarget);
		value.forEach((value) => {
			formData.append(`dokumen`, value);
		});
		formData.append('kreditorId', selectedKreditor);
		formData.append('debitorId', debitorId);
		formData.append('totalVoters', totalVoters);
		formData.append('userId', userId);
		formData.set('pertanggal', jumlahTagihan.pertanggal);
		formData.set('mulaiTertunggak', kurunTunggakan.mulaiTertunggak);
		formData.set('jumlahHari', kurunTunggakan.jumlahHari);
		try {
			const response = await fetch('/api/tagihan', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			});
			const result = await response.json();
			if (result.success) {
				goto('/tagihan')
				showToast(result.message, 'success');
				
			} else {
				submitted = true;
				form = result;
				if (!result.errors) {
					showToast(result.message, 'error');
				}
			}
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	};

	const formatPrice = (price) => {
		if (typeof price !== 'string') {
			price = price.toString(); // Convert to string if it's not already
		}
		const digits = price.replace(/,/g, '');
		const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return formatted;
	};

	function unformatPrice(price) {
		const formatted = price.replace(/,/g, '');
		return formatted;
	}

	$: {
		if (sifatTagihan.id !== '') {
			submitted = false;
		}
		if (buktiTagihan.tipeDokumenId !== '') {
			submitted = false;
		}
	}
</script>

{#if loading}
	<div
		class="fixed inset-0 z-40 flex items-center justify-center bg-gray-900/50 dark:bg-gray-900/80"
	>
		<Spinner color="white" size={10} />
	</div>
{/if}

<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
	<BreadcrumbItem href="/tagihan" home>List Tagihan</BreadcrumbItem>
	<BreadcrumbItem>Form Tagihan</BreadcrumbItem>
</Breadcrumb>
<h2
	class="mb-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
>
	Form Tagihan
</h2>
<form on:submit|preventDefault={handleSubmit} enctype="multipart/form-data">
	<div class="space-y-4">
		<Card size="none" padding="lg">
			<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Identitas Kreditor</h3>

			<div class="relative flex flex-col gap-2 md:flex-row">
				<div class="relative w-full">
					<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
						<svg
							class={`${!selectedKreditor && form?.errors?.find((error) => error.field === 'kreditorId') ? 'text-red-900 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'} h-4 w-4`}
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 20 20"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
							/>
						</svg>
					</div>
					<input
						type="search"
						bind:value={searchKreditor}
						id="default-search"
						class={`${!selectedKreditor && form?.errors?.find((error) => error.field === 'kreditorId') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'} block w-full rounded-lg border ps-10 text-sm`}
						placeholder="Cari Kreditor..."
					/>
				</div>
				<Button size="xs" on:click={() => openAddModal()} color="light"
					><PlusSolid class="me-2 h-5 w-5" />Tambah</Button
				>
				{#if searchKreditor !== ''}
					<div
						class="absolute top-12 z-10 max-h-72 w-full overflow-y-auto rounded-lg bg-white p-0 shadow dark:bg-gray-700"
					>
						<ul class="space-y-2 p-2">
							{#each filteredKreditors as { id, nama, alamat, noTelp, email }}
								<div
									class="flex w-full flex-row items-center justify-between gap-4 rounded-lg px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
								>
									<button
										type="button"
										on:click={() => handleSelectKreditor(id)}
										class="block w-full text-start"
									>
										<div>
											<p
												class="mb-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white"
											>
												{nama}
											</p>
											<p class="text-xs font-normal text-gray-700 dark:text-gray-400">{alamat}</p>
											<p class="text-xs font-normal text-gray-700 dark:text-gray-400">
												{noTelp} | {email}
											</p>
										</div>
									</button>
									<button
										type="button"
										class="h-fit rounded-full bg-gray-300 p-2"
										on:click={() => openEditModal(id, nama, email, noTelp, alamat)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											class="h-4 w-4 shrink-0 text-white"
											role="img"
											aria-label="pen solid"
											viewBox="0 0 24 24"
											><path
												fill="currentColor"
												fill-rule="evenodd"
												d="M14 4.2a4.1 4.1 0 0 1 5.8 0 4 4 0 0 1 0 5.7l-1.3 1.3-5.8-5.7L14 4.2Zm-2.7 2.7-5.1 5.2 2.2 2.2 5-5.2-2.1-2.2ZM5 14l-2 5.8c0 .3 0 .7.3 1 .3.3.7.4 1 .2l6-1.9L5 13.8Zm7 4 5-5.2-2.1-2.2-5.1 5.2 2.2 2.1Z"
												clip-rule="evenodd"
											></path></svg
										>
									</button>
								</div>
							{/each}
							{#if filteredKreditors.length === 0}
								<li class="block space-y-2 rounded-lg py-8 text-center">
									<p class="text-lg font-medium tracking-tight text-gray-500 dark:text-white">
										Kreditor "{searchKreditor}" Tidak Ditemukan
									</p>
								</li>
							{/if}
						</ul>
					</div>
				{/if}
			</div>
			{#if !selectedKreditor && form?.errors?.find((error) => error.field === 'kreditorId')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'kreditorId').message}
				</p>
			{/if}
			{#if selectedKreditorData}
				<div class="mt-4 flex flex-row justify-between rounded-lg bg-gray-50 px-6 py-4">
					<div>
						<p class="mb-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
							{selectedKreditorData.nama}
						</p>
						<p class="text-xs font-normal text-gray-700 dark:text-gray-400">
							{selectedKreditorData.alamat}
						</p>
						<p class="text-xs font-normal text-gray-700 dark:text-gray-400">
							{selectedKreditorData.noTelp} | {selectedKreditorData.email}
						</p>
					</div>
					<div class="h-fit rounded-full bg-gray-300 p-0.5">
						<CloseSolid class="h-4 w-4 text-white" on:click={() => (selectedKreditor = '')} />
					</div>
				</div>
			{/if}
		</Card>
		<Card size="none" padding="lg">
			<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Jumlah Tagihan</h3>
			<div class="mb-6 grid gap-4 sm:gap-6 md:grid-cols-2">
				<div>
					<label
						for="pertanggal"
						class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'pertanggal') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Pertanggal</label
					>

					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
							<svg
								class={`${form?.errors?.find((error) => error.field === 'pertanggal') ? 'text-red-900 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'} h-4 w-4 `}
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
								/>
							</svg>
						</div>
						<DatePicker
							bind:startDate={jumlahTagihan.pertanggal}
							invalid={form?.errors?.find((error) => error.field === 'pertanggal')}
						/>
					</div>
					{#if form?.errors?.find((error) => error.field === 'pertanggal')}
						<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
							{form?.errors?.find((error) => error.field === 'pertanggal').message}
						</p>
					{/if}
				</div>
				<div>
					<label
						for="hutangPokok"
						class={`mb-2 block text-sm font-medium ${jumlahTagihan.hutangPokok === '' && form?.errors?.find((error) => error.field === 'hutangPokok') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Hutang Pokok</label
					>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5">
							<p
								class={`${jumlahTagihan.hutangPokok === '' && form?.errors?.find((error) => error.field === 'hutangPokok') ? 'text-red-900 dark:text-red-500' : 'text-gray-500'}`}
							>
								Rp.
							</p>
						</div>
						<input
							type="text"
							name="hutangPokok"
							placeholder="Hutang Pokok"
							id="hutangPokok"
							bind:value={jumlahTagihan.hutangPokok}
							on:input={() => {
								jumlahTagihan.hutangPokok = formatPrice(jumlahTagihan.hutangPokok);
							}}
							class={`block w-full rounded-lg border p-2.5 ps-10 text-sm ${jumlahTagihan.hutangPokok === '' && form?.errors?.find((error) => error.field === 'hutangPokok') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
						/>
					</div>
					{#if jumlahTagihan.hutangPokok === '' && form?.errors?.find((error) => error.field === 'hutangPokok')}
						<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
							{form?.errors?.find((error) => error.field === 'hutangPokok').message}
						</p>
					{/if}
				</div>
				<div>
					<label
						for="bunga"
						class={`mb-2 block text-sm font-medium ${jumlahTagihan.bunga === '' && form?.errors?.find((error) => error.field === 'bunga') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Bunga</label
					>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5">
							<p
								class={`${jumlahTagihan.bunga === '' && form?.errors?.find((error) => error.field === 'bunga') ? 'text-red-900 dark:text-red-500' : 'text-gray-500'}`}
							>
								Rp.
							</p>
						</div>
						<input
							type="text"
							id="bunga"
							name="bunga"
							placeholder="Bunga"
							bind:value={jumlahTagihan.bunga}
							on:input={() => {
								jumlahTagihan.bunga = formatPrice(jumlahTagihan.bunga);
							}}
							class={`block w-full rounded-lg border p-2.5 ps-10 text-sm ${jumlahTagihan.bunga === '' && form?.errors?.find((error) => error.field === 'bunga') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
						/>
					</div>
					{#if jumlahTagihan.bunga === '' && form?.errors?.find((error) => error.field === 'bunga')}
						<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
							{form?.errors?.find((error) => error.field === 'bunga').message}
						</p>
					{/if}
				</div>
				<div>
					<label
						for="denda"
						class={`mb-2 block text-sm font-medium ${jumlahTagihan.denda === '' && form?.errors?.find((error) => error.field === 'denda') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Denda</label
					>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5">
							<p
								class={`${jumlahTagihan.denda === '' && form?.errors?.find((error) => error.field === 'denda') ? 'text-red-900 dark:text-red-500' : 'text-gray-500'}`}
							>
								Rp.
							</p>
						</div>
						<input
							type="text"
							id="denda"
							name="denda"
							placeholder="Denda"
							bind:value={jumlahTagihan.denda}
							on:input={() => {
								jumlahTagihan.denda = formatPrice(jumlahTagihan.denda);
							}}
							class={`block w-full rounded-lg border p-2.5 ps-10 text-sm ${jumlahTagihan.denda === '' && form?.errors?.find((error) => error.field === 'denda') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
						/>
					</div>
					{#if jumlahTagihan.denda === '' && form?.errors?.find((error) => error.field === 'denda')}
						<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
							{form?.errors?.find((error) => error.field === 'denda').message}
						</p>
					{/if}
				</div>
			</div>
			<div>
				<label
					for="totalTagihan"
					class="mb-2 block text-sm font-medium text-gray-400 dark:text-white">Total</label
				>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5">
						<p class="text-gray-500">Rp.</p>
					</div>
					<input
						id="totalTagihan"
						type="text"
						name="totalTagihan"
						placeholder="Total"
						bind:value={jumlahTagihan.totalTagihan}
						class="block w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 p-2.5 ps-10 text-sm text-gray-900 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
						disabled
						readonly
					/>
				</div>
			</div>
		</Card>
		<Card size="none" padding="lg">
			<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Sifat/Golongan Tagihan</h3>
			<div class="grid gap-4 sm:gap-6 md:grid-cols-2">
				<div>
					<label
						for="sifatTagihan"
						class={`mb-2 block text-sm font-medium ${sifatTagihan.id === '' && form?.errors?.find((error) => error.field === 'sifatTagihanId') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Sifat/Golongan Tagihan</label
					>
					<select
						id="sifatTagihan"
						name="sifatTagihanId"
						bind:value={sifatTagihan.id}
						class={`block w-full rounded-lg border p-2.5 text-sm ${sifatTagihan.id === '' && form?.errors?.find((error) => error.field === 'sifatTagihanId') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
					>
						<option value="" selected disabled>Pilih Sifat Tagihan</option>
						{#each sifatTagihanData as { id, sifat }}
							<option value={id}>{sifat}</option>
						{/each}
					</select>
					{#if sifatTagihan.id === '' && form?.errors?.find((error) => error.field === 'sifatTagihanId')}
						<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
							{form?.errors?.find((error) => error.field === 'sifatTagihanId').message}
						</p>
					{/if}
				</div>
				<div>
					<label
						for="jumlahTagihan"
						class={`mb-2 block text-sm font-medium ${sifatTagihan.jumlahTagihan === '' && form?.errors?.find((error) => error.field === 'jumlahTagihan') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Jumlah Tagihan Seluruhnya</label
					>
					<select
						id="jumlahTagihan"
						name="jumlahTagihan"
						bind:value={sifatTagihan.jumlahTagihan}
						class={`block w-full rounded-lg border p-2.5 text-sm ${sifatTagihan.jumlahTagihan === '' && form?.errors?.find((error) => error.field === 'jumlahTagihan') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
					>
						<option value="" selected disabled>Pilih Jumlah Tagihan Seluruhnya</option>
						<option value="Dijamin">Dijamin</option>
						<option value="Tidak Dijamin">Tidak Dijamin</option>
					</select>
					{#if sifatTagihan.jumlahTagihan === '' && form?.errors?.find((error) => error.field === 'jumlahTagihan')}
						<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
							{form?.errors?.find((error) => error.field === 'jumlahTagihan').message}
						</p>
					{/if}
				</div>
			</div>
		</Card>
		<Card size="none" padding="lg">
			<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Kurun Tunggakan</h3>
			<div class="grid gap-4 sm:gap-6 md:grid-cols-2">
				<div>
					<label
						for="mulaiTertunggak"
						class={`mb-2 block text-sm font-medium ${kurunTunggakan.mulaiTertunggak === '' && form?.errors?.find((error) => error.field === 'mulaiTertunggak') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Mulai Tertunggak Sejak</label
					>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
							<svg
								class={`${form?.errors?.find((error) => error.field === 'mulaiTertunggak') ? 'text-red-900 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'} h-4 w-4 `}
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
								/>
							</svg>
						</div>
						<DatePicker
							bind:startDate={kurunTunggakan.mulaiTertunggak}
							invalid={form?.errors?.find((error) => error.field === 'mulaiTertunggak')}
						/>
					</div>
					{#if form?.errors?.find((error) => error.field === 'mulaiTertunggak')}
						<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
							{form?.errors?.find((error) => error.field === 'mulaiTertunggak').message}
						</p>
					{/if}
				</div>
				<div>
					<label
						for="jumlahHari"
						class={`mb-2 block text-sm font-medium ${kurunTunggakan.jumlahHari === '' && form?.errors?.find((error) => error.field === 'jumlahHari') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Jumlah Hari</label
					>
					<div class="flex flex-row gap-2">
						<input
							type="text"
							name="jumlahHari"
							id="jumlahHari"
							bind:value={kurunTunggakan.jumlahHari}
							placeholder="Jumlah Hari Tunggakan"
							class={`block w-full rounded-lg border p-2.5 text-sm ${kurunTunggakan.jumlahHari === '' && form?.errors?.find((error) => error.field === 'jumlahHari') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
						/>
						<Button type="button" on:click={calculateDay} color="light">Calculate</Button>
					</div>
					{#if kurunTunggakan.jumlahHari === '' && form?.errors?.find((error) => error.field === 'jumlahHari')}
						<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
							{form?.errors?.find((error) => error.field === 'jumlahHari').message}
						</p>
					{/if}
				</div>
			</div>
		</Card>
		<Card size="none" padding="lg">
			<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
				Daftar Bukti Tagihan (Foto Copy)
			</h3>
			<div class="space-y-4">
				{#each buktiTagihan as bukti, index (bukti)}
					<div>
						<label
							for="tipeDokumenId"
							class={`mb-2 block text-sm font-medium ${submitted && sifatTagihan.id !== '' && bukti.tipeDokumenId === '' ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
							>Tipe Dokumen</label
						>
						<div class="flex flex-row gap-4">
							<Select
								class={`${submitted && sifatTagihan.id !== '' && bukti.tipeDokumenId === '' ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 disabled:text-red-900 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-primary-500 focus:ring-primary-500 disabled:text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500'} rounded-lg border`}
								bind:value={bukti.tipeDokumenId}
								name="tipeDokumenId"
								placeholder="Pilih Sifat/Golongan Tagihan Terlebih Dahulu"
								disabled={sifatTagihan.id === ''}
							>
								{#each tipeDokumenData as { id, tipe, sifatTagihanId }}
									{#if sifatTagihanId === sifatTagihan.id}
										<option value={id}>{tipe}</option>
									{/if}
								{/each}
							</Select>
							{#if buktiTagihan.length !== 1}
								<Button color="light" on:click={() => handleRemoveTagihan(index)}
									><MinusSolid class="h-5 w-5" /></Button
								>
							{/if}
							{#if buktiTagihan.length - 1 === index}
								<Button on:click={() => handleAddTagihan()} color="light"
									><PlusSolid class="h-5 w-5" /></Button
								>
							{/if}
						</div>
						{#if submitted && sifatTagihan.id !== '' && bukti.tipeDokumenId === ''}
							<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
								Tipe dokumen tidak boleh kosong!
							</p>
						{/if}
					</div>
					<div>
						<label
							for="dokumen"
							class={`mb-2 block text-sm font-medium ${submitted && bukti.tipeDokumenId !== '' && bukti.dokumen === '' ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
							>Bukti Dokumen</label
						>
						<Fileupload
							id="with_helper"
							class="mb-2"
							accept=".pdf,"
							bind:files={bukti.dokumen}
							name="dokumen"
							disabled={bukti.tipeDokumenId === ''}
							color={submitted && bukti.tipeDokumenId !== '' && bukti.dokumen === '' ? 'red' : ''}
						/>
						<Helper>PDF (MAX. 25 MB).</Helper>
						{#if submitted && bukti.tipeDokumenId !== '' && bukti.dokumen === ''}
							<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
								Dokumen tidak boleh kosong!
							</p>
						{:else if form?.errors?.find((error) => error.field === `dokumen.${index}`)}
							<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
								{form?.errors?.find((error) => error.field === `dokumen.${index}`).message}
							</p>
						{/if}
					</div>
				{/each}
			</div>
		</Card>
	</div>
	<div class="my-4 flex justify-end gap-2">
		<Button type="submit">Submit tagihan</Button>
		<Button href="../" color="red">Batal</Button>
	</div>
</form>
<!-- Add Kreditor Modal -->
<Modal
	bind:open={formModal}
	size="xs"
	autoclose={false}
	class="w-full"
	backdropClass="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
>
	<form method="POST" class="flex flex-col space-y-4" on:submit|preventDefault={handleAddKreditor}>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Tambah kreditor baru</h3>
		<label
			for="nama"
			class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'nama') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
		>
			<span>Nama</span>
			<input
				type="text"
				name="nama"
				bind:value={kreditor.nama}
				placeholder="Masukkan Nama"
				class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'nama') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
			/>
			{#if form?.errors?.find((error) => error.field === 'nama')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'nama').message}
				</p>
			{/if}
		</label>
		<label
			for="email"
			class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'email') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
		>
			<span>Email</span>
			<input
				type="text"
				name="email"
				bind:value={kreditor.email}
				placeholder="Masukkan Email"
				class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'email') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
			/>
			{#if form?.errors?.find((error) => error.field === 'email')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'email').message}
				</p>
			{/if}
		</label>
		<label
			for="noTelp"
			class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'noTelp') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
		>
			<span>No. Telepon</span>
			<input
				type="text"
				name="noTelp"
				bind:value={kreditor.noTelp}
				placeholder="Masukkan No Telepon"
				class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'noTelp') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
			/>
			{#if form?.errors?.find((error) => error.field === 'noTelp')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'noTelp').message}
				</p>
			{/if}
		</label>
		<label
			for="alamat"
			class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'alamat') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
		>
			<span>Alamat</span>
			<textarea
				id="textarea-id"
				bind:value={kreditor.alamat}
				placeholder="Masukkan Alamat"
				rows="2"
				name="alamat"
				class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'alamat') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
			></textarea>
			{#if form?.errors?.find((error) => error.field === 'alamat')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'alamat').message}
				</p>
			{/if}
		</label>
		<Button type="submit">
			{#if loading}
				<Spinner class="me-2" size="4" color="white" />
			{:else}
				Tambah Kreditor
			{/if}
		</Button>
	</form>
</Modal>
<!-- Edit Kreditor Modal -->
<Modal
	bind:open={editModal}
	size="xs"
	autoclose={false}
	class="w-full"
	backdropClass="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
>
	<form method="POST" class="flex flex-col space-y-4" on:submit|preventDefault={handleEditKreditor}>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Edit kreditor</h3>
		<label
			for="nama"
			class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'nama') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
		>
			<span>Nama</span>
			<input
				type="text"
				name="nama"
				bind:value={kreditor.nama}
				placeholder="Masukkan Nama"
				class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'nama') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
			/>
			{#if form?.errors?.find((error) => error.field === 'nama')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'nama').message}
				</p>
			{/if}
		</label>
		<label
			for="email"
			class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'email') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
		>
			<span>Email</span>
			<input
				type="text"
				name="email"
				bind:value={kreditor.email}
				placeholder="Masukkan Email"
				class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'email') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
			/>
			{#if form?.errors?.find((error) => error.field === 'email')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'email').message}
				</p>
			{/if}
		</label>
		<label
			for="noTelp"
			class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'noTelp') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
		>
			<span>No. Telepon</span>
			<input
				type="text"
				name="noTelp"
				bind:value={kreditor.noTelp}
				placeholder="Masukkan No Telepon"
				class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'noTelp') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
			/>
			{#if form?.errors?.find((error) => error.field === 'noTelp')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'noTelp').message}
				</p>
			{/if}
		</label>
		<label
			for="alamat"
			class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'alamat') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
		>
			<span>Alamat</span>
			<textarea
				id="textarea-id"
				bind:value={kreditor.alamat}
				placeholder="Masukkan Alamat"
				rows="2"
				name="alamat"
				class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'alamat') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
			></textarea>
			{#if form?.errors?.find((error) => error.field === 'alamat')}
				<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
					{form?.errors?.find((error) => error.field === 'alamat').message}
				</p>
			{/if}
		</label>
		<Button type="submit">
			{#if loading}
				<Spinner class="me-2" size="4" color="white" />
			{:else}
				Ubah Kreditor
			{/if}
		</Button>
	</form>
</Modal>
