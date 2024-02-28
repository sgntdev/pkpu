<script>
	import {
		Card,
		Label,
		Input,
		Button,
		Select,
		Modal,
		Spinner,
		Breadcrumb,
		BreadcrumbItem,
		Helper,
		Dropzone,
		Textarea
	} from 'flowbite-svelte';
	import { PlusSolid, MinusSolid, CloseSolid } from 'flowbite-svelte-icons';
	import { deserialize } from '$app/forms';
	import { goto } from '$app/navigation';

	export let data;
	const { kreditorData, sifatTagihanData, tipeDokumenData } = data.body;
	let buktiTagihan = [
		{
			tipeDokumenId: '',
			dokumen: null
		}
	];
	let formModal = false;
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
	const handleAddKreditor = async (event) => {
		const { target } = event;
		loading = true;
		try {
			const response = await fetch('?/addKreditor', {
				method: 'POST',
				body: new FormData(target)
			});
			const result = deserialize(await response.text());
			form = result;
			if (result.data.success) {
				target.reset();
				formModal = false;
			} else {
				console.error(result.data.message);
			}
		} catch (error) {
			console.log(error);
		} finally {
			loading = false;
		}
	};
	const handleSubmit = async (event) => {
		loading = true;
		const formData = new FormData(event.currentTarget);
		value.forEach((value) => {
			formData.append(`dokumen`, value);
		});
		formData.append('kreditorId', selectedKreditor);
		try {
			const response = await fetch('?/addTagihan', {
				method: 'POST',
				body: formData
			});
			const result = deserialize(await response.text());
			form = result;
			if (result.data.success) {
				goto('./', {
					replaceState: true,
					state: {
						success: true,
						message: 'Tagihan berhasil ditambahkan!'
					}
				});
			} else {
				console.error(result.data.message);
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
</script>

{#if data.status == 200}
	<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
		<BreadcrumbItem href="./" home>List Tagihan</BreadcrumbItem>
		<BreadcrumbItem>Form Tagihan</BreadcrumbItem>
	</Breadcrumb>
	<h2
		class="mb-4 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
	>
		Form Tagihan
	</h2>
	<form method="POST" on:submit|preventDefault={handleSubmit} enctype="multipart/form-data">
		<div class="space-y-4">
			<Card size="none" padding="lg">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Identitas Kreditor</h3>
				<!-- Searchbar -->
				<div class="relative">
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
							<svg
								class={`${form?.data?.errors?.find((error) => error.field === 'kreditorId') ? 'text-red-900 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'} h-4 w-4`}
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
							class={`${form?.data?.errors?.find((error) => error.field === 'kreditorId') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'} block w-full rounded-lg border ps-10 text-sm`}
							placeholder="Cari Kreditor..."
						/>
					</div>
					{#if form?.data?.errors?.find((error) => error.field === 'kreditorId')}
						<Helper class="mt-2" color="red">Identitas kreditor tidak boleh kosong!</Helper>
					{/if}
					{#if searchKreditor !== ''}
						<div
							class="absolute z-10 mt-2 max-h-72 w-full overflow-y-auto rounded-lg bg-white p-0 shadow dark:bg-gray-700"
						>
							<ul class="space-y-2 p-2">
								{#each filteredKreditors as { id, nama, alamat, noTelp, email }}
									<button
										type="button"
										on:click={() => handleSelectKreditor(id)}
										class="block w-full rounded-lg px-4 py-2 text-start hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
									>
										<p
											class="mb-1 text-lg font-semibold tracking-tight text-gray-900 dark:text-white"
										>
											{nama}
										</p>
										<p class="text-xs font-normal text-gray-700 dark:text-gray-400">{alamat}</p>
										<p class="text-xs font-normal text-gray-700 dark:text-gray-400">
											{noTelp} | {email}
										</p>
									</button>
								{/each}
								{#if filteredKreditors.length === 0}
									<li class="block space-y-2 rounded-lg py-8 text-center">
										<p class="text-lg font-medium tracking-tight text-gray-500 dark:text-white">
											Kreditor "{searchKreditor}" Tidak Ditemukan
										</p>
										<Button size="xs" on:click={() => (formModal = true)}
											><PlusSolid class="h-5 w-5" /> Tambah Kreditor Baru</Button
										>
									</li>
								{/if}
							</ul>
						</div>
					{/if}
				</div>
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
						<Label
							for="pertanggal"
							class="mb-2"
							color={form?.data?.errors?.find((error) => error.field === 'pertanggal')
								? 'red'
								: undefined}>Pertanggal</Label
						>
						<!-- Datepicker -->
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
								<svg
									class={`${form?.data?.errors?.find((error) => error.field === 'kreditorId') ? 'text-red-900 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'} h-4 w-4 `}
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
								class={`${form?.data?.errors?.find((error) => error.field === 'pertanggal') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'} block w-full rounded-lg border p-2.5 ps-10 text-sm`}
								placeholder="Pilih Tanggal"
							/>
						</div>
						{#if form?.data?.errors?.find((error) => error.field === 'pertanggal')}
							<Helper class="mt-2" color="red">Pertanggal tidak boleh kosong!</Helper>
						{/if}
					</div>
					<div>
						<Label
							for="hutangPokok"
							class="mb-2"
							color={form?.data?.errors?.find((error) => error.field === 'hutangPokok')
								? 'red'
								: undefined}>Hutang Pokok</Label
						>
						<Input
							id="hutangPokok"
							color={form?.data?.errors?.find((error) => error.field === 'hutangPokok')
								? 'red'
								: undefined}
							type="text"
							name="hutangPokok"
							placeholder="Hutang Pokok"
							bind:value={jumlahTagihan.hutangPokok}
							on:input={() => {
								jumlahTagihan.hutangPokok = formatPrice(jumlahTagihan.hutangPokok);
							}}
						>
							<p
								slot="left"
								class={`${form?.data?.errors?.find((error) => error.field === 'hutangPokok') ? 'text-red-900 dark:text-red-500' : ''}`}
							>
								Rp.
							</p>
						</Input>

						{#if form?.data?.errors?.find((error) => error.field === 'hutangPokok')}
							<Helper class="mt-2" color="red">Hutang pokok tidak boleh kosong!</Helper>
						{/if}
					</div>
					<div>
						<Label
							for="bunga"
							class="mb-2"
							color={form?.data?.errors?.find((error) => error.field === 'bunga')
								? 'red'
								: undefined}>Bunga</Label
						>
						<Input
							id="bunga"
							color={form?.data?.errors?.find((error) => error.field === 'bunga')
								? 'red'
								: undefined}
							type="text"
							name="bunga"
							placeholder="Bunga"
							bind:value={jumlahTagihan.bunga}
							on:input={() => {
								jumlahTagihan.bunga = formatPrice(jumlahTagihan.bunga);
							}}
						>
							<p
								slot="left"
								class={`${form?.data?.errors?.find((error) => error.field === 'bunga') ? 'text-red-900 dark:text-red-500' : ''}`}
							>
								Rp.
							</p>
						</Input>

						{#if form?.data?.errors?.find((error) => error.field === 'bunga')}
							<Helper class="mt-2" color="red">Bunga tidak boleh kosong!</Helper>
						{/if}
					</div>
					<div>
						<Label
							for="denda"
							class="mb-2"
							color={form?.data?.errors?.find((error) => error.field === 'denda')
								? 'red'
								: undefined}>Denda</Label
						>
						<Input
							id="denda"
							color={form?.data?.errors?.find((error) => error.field === 'denda')
								? 'red'
								: undefined}
							type="text"
							name="denda"
							placeholder="Denda"
							bind:value={jumlahTagihan.denda}
							on:input={() => {
								jumlahTagihan.denda = formatPrice(jumlahTagihan.denda);
							}}
						>
							<p
								slot="left"
								class={`${form?.data?.errors?.find((error) => error.field === 'denda') ? 'text-red-900 dark:text-red-500' : ''}`}
							>
								Rp.
							</p>
						</Input>

						{#if form?.data?.errors?.find((error) => error.field === 'denda')}
							<Helper class="mt-2" color="red">Denda tidak boleh kosong!</Helper>
						{/if}
					</div>
				</div>
				<div>
					<Label for="totalTagihan" class="mb-2">Total</Label>
					<Input
						id="totalTagihan"
						type="text"
						name="totalTagihan"
						placeholder="Total"
						bind:value={jumlahTagihan.totalTagihan}
						disabled
					>
						<p slot="left">Rp.</p>
					</Input>
				</div>
			</Card>
			<Card size="none" padding="lg">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
					Sifat/Golongan Tagihan
				</h3>
				<div class="grid gap-4 sm:gap-6 md:grid-cols-2">
					<div>
						<Label
							for="sifatTagihan"
							class="mb-2"
							color={form?.data?.errors?.find((error) => error.field === 'sifatTagihanId')
								? 'red'
								: undefined}>Sifat/Golongan Tagihan</Label
						>
						<Select
							id="sifatTagihan"
							class={`${form?.data?.errors?.find((error) => error.field === 'sifatTagihanId') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500'} mt-2 rounded-lg border focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500`}
							name="sifatTagihanId"
							bind:value={sifatTagihan.id}
							placeholder="Pilih Sifat Tagihan"
						>
							{#each sifatTagihanData as { id, sifat }}
								<option value={id}>{sifat}</option>
							{/each}
						</Select>
						{#if form?.data?.errors?.find((error) => error.field === 'sifatTagihanId')}
							<Helper class="mt-2" color="red">Sifat/golongan tagihan tidak boleh kosong!</Helper>
						{/if}
					</div>
					<div>
						<Label
							for="jumlahTagihan"
							class="mb-2"
							color={form?.data?.errors?.find((error) => error.field === 'jumlahTagihan')
								? 'red'
								: undefined}>Jumlah Tagihan Seluruhnya</Label
						>
						<Select
							id="jumlahTagihan"
							class={`${form?.data?.errors?.find((error) => error.field === 'jumlahTagihan') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500'} mt-2 rounded-lg border focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500`}
							bind:value={sifatTagihan.jumlahTagihan}
							name="jumlahTagihan"
							placeholder="Pilih Jumlah Tagihan Seluruhnya"
						>
							<option value="Dijamin">Dijamin</option>
							<option value="Tidak Dijamin">Tidak Dijamin</option>
						</Select>
						{#if form?.data?.errors?.find((error) => error.field === 'jumlahTagihan')}
							<Helper class="mt-2" color="red">Jumlah tagihan tidak boleh kosong!</Helper>
						{/if}
					</div>
				</div>
			</Card>
			<Card size="none" padding="lg">
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Kurun Tunggakan</h3>
				<div class="grid gap-4 sm:gap-6 md:grid-cols-2">
					<div>
						<Label
							for="mulaiTertunggak"
							class="mb-2"
							color={form?.data?.errors?.find((error) => error.field === 'mulaiTertunggak')
								? 'red'
								: undefined}>Mulai Tertunggak Sejak</Label
						>
						<!-- Datepicker -->
						<div class="relative">
							<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
								<svg
									class={`${form?.data?.errors?.find((error) => error.field === 'mulaiTertunggak') ? 'text-red-900 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'} h-4 w-4 `}
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
								class={`${form?.data?.errors?.find((error) => error.field === 'kreditorId') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'} block w-full rounded-lg border p-2.5 ps-10 text-sm`}
								placeholder="Pilih Tanggal"
							/>
						</div>
						{#if form?.data?.errors?.find((error) => error.field === 'mulaiTertunggak')}
							<Helper class="mt-2" color="red">Mulai tertunggak tidak boleh kosong!</Helper>
						{/if}
					</div>
					<div>
						<Label
							for="jumlahHari"
							class="mb-2"
							color={form?.data?.errors?.find((error) => error.field === 'jumlahHari')
								? 'red'
								: undefined}>Jumlah Hari Tunggakan</Label
						>
						<Input
							color={form?.data?.errors?.find((error) => error.field === 'jumlahHari')
								? 'red'
								: undefined}
							type="text"
							name="jumlahHari"
							id="jumlahHari"
							bind:value={kurunTunggakan.jumlahHari}
							placeholder="Jumlah Hari Tunggakan"
						/>
						{#if form?.data?.errors?.find((error) => error.field === 'jumlahHari')}
							<Helper class="mt-2" color="red">Jumlah hari tidak boleh kosong!</Helper>
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
									class={`${sifatTagihan.id !== '' && form?.data?.errors?.find((error) => error.field === 'dokumen' || `dokumen.${index}`) ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 disabled:text-red-900 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-primary-500 focus:ring-primary-500 disabled:text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500'} rounded-lg border`}
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
								{#if form?.data?.errors?.find((error) => error.field === `dokumen`)}
									<Helper class="mt-2" color="red">Bukti tagihan tidak boleh kosong!</Helper>
								{:else if form?.data?.errors?.find((error) => error.field === `dokumen.${index}`)}
									<Helper class="mt-2" color="red"
										>{form?.data?.errors?.find((error) => error.field === `dokumen.${index}`)
											.message}</Helper
									>
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
									defaultClass={`${sifatTagihan.id === '' ? '' : 'cursor-pointer hover:bg-gray-100'} mt-4 flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed dark:hover:bg-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
									id="dropzone"
									on:drop={(e) => dropHandle(e, index)}
									on:dragover={(event) => {
										event.preventDefault();
									}}
									on:change={(e) => handleChange(e, index)}
									disabled={bukti.tipeDokumenId === ''}
									accept=".pdf,"
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
		<form
			method="POST"
			class="flex flex-col space-y-4"
			on:submit|preventDefault={handleAddKreditor}
		>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">Tambah kreditor baru</h3>
			<Label
				class="space-y-2"
				color={form?.data?.errors?.find((error) => error.field === 'nama') ? 'red' : undefined}
			>
				<span>Nama</span>
				<Input
					type="text"
					name="nama"
					placeholder="Masukkan Nama"
					color={form?.data?.errors?.find((error) => error.field === 'nama') ? 'red' : undefined}
				/>
				{#if form?.data?.errors?.find((error) => error.field === 'nama')}
					<Helper class="mt-2" color="red"
						>{form?.data?.errors?.find((error) => error.field === 'nama').message}</Helper
					>
				{/if}
			</Label>
			<Label
				class="space-y-2"
				color={form?.data?.errors?.find((error) => error.field === 'email') ? 'red' : undefined}
			>
				<span>Email</span>
				<Input
					type="text"
					name="email"
					placeholder="Masukkan Email"
					color={form?.data?.errors?.find((error) => error.field === 'email') ? 'red' : undefined}
				/>
				{#if form?.data?.errors?.find((error) => error.field === 'email')}
					<Helper class="mt-2" color="red"
						>{form?.data?.errors?.find((error) => error.field === 'email').message}</Helper
					>
				{/if}
			</Label>
			<Label
				class="space-y-2"
				color={form?.data?.errors?.find((error) => error.field === 'noTelp') ? 'red' : undefined}
			>
				<span>No. Telepon</span>
				<Input
					type="text"
					name="noTelp"
					placeholder="Masukkan No Telepon"
					color={form?.data?.errors?.find((error) => error.field === 'noTelp') ? 'red' : undefined}
				/>
				{#if form?.data?.errors?.find((error) => error.field === 'noTelp')}
					<Helper class="mt-2" color="red"
						>{form?.data?.errors?.find((error) => error.field === 'noTelp').message}</Helper
					>
				{/if}
			</Label>
			<Label
				class="space-y-2"
				color={form?.data?.errors?.find((error) => error.field === 'alamat') ? 'red' : undefined}
			>
				<span>Alamat</span>
				<Textarea
					id="textarea-id"
					placeholder="Masukkan Alamat"
					rows="2"
					name="alamat"
					class={`${form?.data?.errors?.find((error) => error.field === 'alamat') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'} block w-full rounded-lg border ps-10 text-sm`}
				/>
				{#if form?.data?.errors?.find((error) => error.field === 'alamat')}
					<Helper class="mt-2" color="red"
						>{form?.data?.errors?.find((error) => error.field === 'alamat').message}</Helper
					>
				{/if}
			</Label>
			<Button type="submit">
				{#if loading}
					<Spinner class="me-2" size="4" color="white" />
					Loading ...
				{:else}
					<PlusSolid class="me-2 h-4 w-4" />Tambah Kreditor
				{/if}
			</Button>
		</form>
	</Modal>
{:else}
	<h1>Unauthorized</h1>
{/if}
