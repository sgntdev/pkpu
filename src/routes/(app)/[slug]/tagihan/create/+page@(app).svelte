<script>
	import {
		Card,
		Button,
		Select,
		Modal,
		Spinner,
		Breadcrumb,
		BreadcrumbItem,
		Dropzone,
		Toast
	} from 'flowbite-svelte';
	import {
		PlusSolid,
		MinusSolid,
		CloseSolid,
		PenSolid,
		ExclamationCircleOutline,
		CheckCircleSolid
	} from 'flowbite-svelte-icons';
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	export let data;
	const { token, debitor, userId, sifatTagihanData, tipeDokumenData } = data.body;
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
	let showToast = false;
	let toastData;
	let selectedKreditor = '';
	let searchKreditor = '';
	let previewURL = [];
	let value = [];
	const dropHandle = (event, index) => {
		event.preventDefault();
		if (buktiTagihan[index].tipeDokumenId) {
			[...event.dataTransfer.items].forEach((item, i) => {
				if (item.kind === 'file') {
					const file = item.getAsFile();
					value.push(file);
					value = value;
					const reader = new FileReader();

					reader.onload = (e) => {
						// Cek apakah sudah ada pratinjau di index ini
						if (previewURL[index]) {
							// Jika sudah ada, gantilah dengan pratinjau baru
							previewURL[index] = e.target.result;
						} else {
							// Jika belum ada, tambahkan pratinjau baru
							previewURL.push(e.target.result);
						}

						previewURL = previewURL.slice(); // Perbarui reaktivitas
					};

					reader.readAsDataURL(file);
				}
			});
		}
	};

	const handleChange = (event, index) => {
		const files = event.target.files;
		if (files.length > 0) {
			value.push(files[0]);
			value = value;
			const reader = new FileReader();

			reader.onload = (e) => {
				// Cek apakah sudah ada pratinjau di index ini
				if (previewURL[index]) {
					// Jika sudah ada, gantilah dengan pratinjau baru
					previewURL[index] = e.target.result;
				} else {
					// Jika belum ada, tambahkan pratinjau baru
					previewURL.push(e.target.result);
				}

				previewURL = previewURL.slice(); // Perbarui reaktivitas
			};

			reader.readAsDataURL(files[0]);
		}
	};

	$: filteredKreditors = kreditorData.filter((kreditor) =>
		kreditor.nama.toLowerCase().includes(searchKreditor.toLowerCase())
	);

	const handleSelectKreditor = (kreditorId) => {
		selectedKreditor = kreditorId;
		searchKreditor = '';
	};
	$: selectedKreditorData = kreditorData.find((kreditor) => kreditor.id === selectedKreditor);
	let jumlahTagihan = {
		pertanggal: '',
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
		mulaiTertunggak: '',
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

	let loading = false;
	let form;
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
				showToast = true;
				toastData = {
					success: true,
					message: result.message
				};
				setTimeout(() => {
					showToast = false;
					clearToastData();
				}, 2000);
				kreditor = {
					userId,
					nama: '',
					email: '',
					noTelp: '',
					alamat: ''
				};
				const updatedDataResponse = await fetch(`/api/kreditor`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const updatedData = await updatedDataResponse.json();
				const formattedData = updatedData.filter((data) => data.userId === userId);
				kreditorData = formattedData;
			} else {
				showToast = true;
				toastData = {
					success: false,
					message: result.message
				};
				setTimeout(() => {
					showToast = false;
					clearToastData();
				}, 2000);
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
				showToast = true;
				toastData = {
					success: true,
					message: result.message
				};
				setTimeout(() => {
					showToast = false;
					clearToastData();
				}, 2000);
				const updatedDataResponse = await fetch(`/api/kreditor`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const updatedData = await updatedDataResponse.json();
				const formattedData = updatedData.filter((data) => data.userId === userId);
				kreditorData = formattedData;
			} else {
				showToast = true;
				toastData = {
					success: false,
					message: result.message
				};
				setTimeout(() => {
					showToast = false;
					clearToastData();
				}, 2000);
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading = false;
		}
	};
	const openAddModal = () => {
		formModal = true
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
	const handleSubmit = async (event) => {
		loading = true;
		const formData = new FormData(event.currentTarget);
		value.forEach((value) => {
			formData.append(`dokumen`, value);
		});
		formData.append('kreditorId', selectedKreditor);
		formData.append('debitorId', debitor.id);
		formData.append('userId', userId);
		try {
			const response = await fetch('/api/tagihan', {
				method: 'POST',
				headers: {
					// 'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${token}`
				},
				body: formData
			});
			const result = await response.json();
			if (result.success) {
				goto('./', {
					replaceState: true,
					state: {
						statusSuccess: true,
						message: 'Tagihan berhasil ditambahkan!'
					}
				});
			} else {
				form = result;
				console.error(result.message);
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
	const clearToastData = () => {
		toastData = null;
	};
</script>

{#if showToast}
	<div transition:fly={{ x: 200 }} class="top-15 absolute end-5">
		<Toast color={toastData?.success ? 'green' : 'red'} class="z-50 mb-4">
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

<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
	<BreadcrumbItem href="/" home>List Debitor</BreadcrumbItem>
	<BreadcrumbItem href="./">List Tagihan</BreadcrumbItem>
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
				<Button size="xs" on:click={() => openAddModal()}
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
						<input
							id="pertanggal"
							datepicker
							datepicker-format="dd MM yyyy"
							datepicker-title="Pertanggal"
							datepicker-autohide
							name="pertanggal"
							type="text"
							class={`block w-full rounded-lg border p-2.5 ps-10 text-sm ${form?.errors?.find((error) => error.field === 'pertanggal') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
							placeholder="Pilih Tanggal"
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
						class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'hutangPokok') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Hutang Pokok</label
					>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5">
							<p
								class={`${form?.errors?.find((error) => error.field === 'hutangPokok') ? 'text-red-900 dark:text-red-500' : 'text-gray-500'}`}
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
							class={`block w-full rounded-lg border p-2.5 ps-10 text-sm ${form?.errors?.find((error) => error.field === 'hutangPokok') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
						/>
					</div>
					{#if form?.errors?.find((error) => error.field === 'hutangPokok')}
						<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
							{form?.errors?.find((error) => error.field === 'hutangPokok').message}
						</p>
					{/if}
				</div>
				<div>
					<label
						for="bunga"
						class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'bunga') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Bunga</label
					>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5">
							<p
								class={`${form?.errors?.find((error) => error.field === 'bunga') ? 'text-red-900 dark:text-red-500' : 'text-gray-500'}`}
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
							class={`block w-full rounded-lg border p-2.5 ps-10 text-sm ${form?.errors?.find((error) => error.field === 'bunga') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
						/>
					</div>
					{#if form?.errors?.find((error) => error.field === 'bunga')}
						<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
							{form?.errors?.find((error) => error.field === 'bunga').message}
						</p>
					{/if}
				</div>
				<div>
					<label
						for="denda"
						class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'denda') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Denda</label
					>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5">
							<p
								class={`${form?.errors?.find((error) => error.field === 'denda') ? 'text-red-900 dark:text-red-500' : 'text-gray-500'}`}
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
							class={`block w-full rounded-lg border p-2.5 ps-10 text-sm ${form?.errors?.find((error) => error.field === 'denda') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
						/>
					</div>
					{#if form?.errors?.find((error) => error.field === 'denda')}
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
						class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'sifatTagihanId') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Pertanggal</label
					>
					<select
						id="sifatTagihan"
						name="sifatTagihanId"
						bind:value={sifatTagihan.id}
						class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'pertanggal') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
					>
						<option value="" selected disabled>Pilih Sifat Tagihan</option>
						{#each sifatTagihanData as { id, sifat }}
							<option value={id}>{sifat}</option>
						{/each}
					</select>
					{#if form?.errors?.find((error) => error.field === 'sifatTagihanId')}
						<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
							{form?.errors?.find((error) => error.field === 'sifatTagihanId').message}
						</p>
					{/if}
				</div>
				<div>
					<label
						for="jumlahTagihan"
						class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'jumlahTagihan') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Jumlah Tagihan Seluruhnya</label
					>
					<select
						id="jumlahTagihan"
						name="jumlahTagihan"
						bind:value={sifatTagihan.jumlahTagihan}
						class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'jumlahTagihan') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
					>
						<option value="" selected disabled>Pilih Jumlah Tagihan Seluruhnya</option>
						<option value="Dijamin">Dijamin</option>
						<option value="Tidak Dijamin">Tidak Dijamin</option>
					</select>
					{#if form?.errors?.find((error) => error.field === 'jumlahTagihan')}
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
						class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'mulaiTertunggak') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
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
						<input
							id="mulaiTertunggak"
							datepicker
							datepicker-format="dd MM yyyy"
							datepicker-title="Mulai Tertunggak Sejak"
							datepicker-autohide
							type="text"
							name="mulaiTertunggak"
							class={`block w-full rounded-lg border p-2.5 ps-10 text-sm ${form?.errors?.find((error) => error.field === 'mulaiTertunggak') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
							placeholder="Pilih Tanggal"
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
						class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'jumlahHari') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Jumlah Hari</label
					>
					<input
						type="text"
						name="jumlahHari"
						id="jumlahHari"
						bind:value={kurunTunggakan.jumlahHari}
						placeholder="Jumlah Hari Tunggakan"
						class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'jumlahHari') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
					/>
					{#if form?.errors?.find((error) => error.field === 'jumlahHari')}
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
						<div class="flex flex-row gap-4">
							<Select
								class={`${sifatTagihan.id !== '' && form?.errors?.find((error) => error.field === 'dokumen' || `dokumen.${index}`) ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 disabled:text-red-900 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-primary-500 focus:ring-primary-500 disabled:text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500'} rounded-lg border`}
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
								<Button color="red" on:click={() => handleRemoveTagihan(index)}
									><MinusSolid class="h-5 w-5" /></Button
								>
							{/if}
							{#if buktiTagihan.length - 1 === index}
								<Button on:click={() => handleAddTagihan()}><PlusSolid class="h-5 w-5" /></Button>
							{/if}
						</div>
						{#if sifatTagihan.id !== ''}
							{#if form?.errors?.find((error) => error.field === `dokumen`)}
								<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
									{form?.errors?.find((error) => error.field === 'dokumen').message}
								</p>
							{:else if form?.errors?.find((error) => error.field === `dokumen.${index}`)}
								<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
									{form?.errors?.find((error) => error.field === `dokumen.${index}`).message}
								</p>
							{/if}
						{/if}

						{#if previewURL[index]}
							<div>
								<iframe
									src={previewURL[index]}
									class="mb-2 mt-4 max-h-64 w-full rounded-lg border-2 border-gray-300"
									width="600"
									height="400"
									frameborder="0"
									title="s"
								/>
							</div>
						{:else}
							<Dropzone
								defaultClass={`${bukti.tipeDokumenId === '' ? '' : 'cursor-pointer hover:bg-gray-100'} mt-4 flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
								id="dropzone"
								on:drop={(e) => dropHandle(e, index)}
								on:dragover={(event) => {
									event.preventDefault();
								}}
								on:change={(e) => handleChange(e, index)}
								disabled={bukti.tipeDokumenId === ''}
								accept=".pdf,"
								bind:files={bukti.dokumen}
							>
								<svg
									aria-hidden="true"
									class={`mb-3 h-10 w-10 ${bukti.tipeDokumenId === '' ? 'text-gray-300' : 'text-gray-400'}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
									/></svg
								>
								<p
									class={`${bukti.tipeDokumenId === '' ? 'text-gray-300 dark:text-gray-200' : ' text-gray-500 dark:text-gray-400'} mb-2 text-sm`}
								>
									<span class="font-semibold">Click to upload</span> or drag and drop
								</p>
								<p
									class={`text-xs ${bukti.tipeDokumenId === '' ? 'text-gray-300 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}
								>
									PDF (MAX. 2 MB)
								</p>
							</Dropzone>
						{/if}
					</div>
				{/each}
			</div>
		</Card>
	</div>
	<div class="mt-4 flex justify-end">
		<Button type="submit">
			{#if loading}<Spinner color="white" size={4} />
			{:else}
				Submit
			{/if}
		</Button>
	</div>
</form>
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
				<PlusSolid class="me-2 h-4 w-4" />Tambah Kreditor
			{/if}
		</Button>
	</form>
</Modal>
<Modal
	bind:open={editModal}
	size="xs"
	autoclose={false}
	class="w-full"
	backdropClass="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
>
	<form method="POST" class="flex flex-col space-y-4" on:submit|preventDefault={handleEditKreditor}>
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
				<PlusSolid class="me-2 h-4 w-4" />Ubah Kreditor
			{/if}
		</Button>
	</form>
</Modal>
