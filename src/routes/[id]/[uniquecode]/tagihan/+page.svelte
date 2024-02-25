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
		BreadcrumbItem
	} from 'flowbite-svelte';
	import { PlusSolid, MinusSolid, CloseSolid } from 'flowbite-svelte-icons';
	import { deserialize } from '$app/forms';

	export let data;
	let dokumen;
	let previewURL = [];
	let isDragging = false;
	// Mengubah file dokumen bukti tagihan
	const handleChange = (index) => {
		const inputElement = document.getElementById(`dropzone-file-${index}`);
		const files = inputElement.files;
		if (files.length > 0) {
			const reader = new FileReader();

			reader.onload = (e) => {
				previewURL[index] = e.target.result;
				previewURL = previewURL.slice();
			};

			reader.readAsDataURL(files[0]);
		}
	};
	// Menambahkan file dengan drag and drop
	const handleDrop = (index, event) => {
		event.preventDefault();
		if (sifatTagihan.id !== '') {
			isDragging = false;
			const files = event.dataTransfer.files;

			if (files.length > 0) {
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
		}
	};
	$: console.log(previewURL);
	const handleDragOver = (event) => {
		event.preventDefault();
		if (sifatTagihan.id !== '') {
			isDragging = true;
		}
	};

	const handleRemove = (index) => {
		previewURL.splice(index, 1);
		previewURL = previewURL.slice();
	};

	let formModal = false;
	let buktiTagihan = [
		{
			tipeDokumenId: '',
			dokumen: null
		}
	];
	let selectedKreditor = '';
	let searchKreditor = '';

	$: filteredKreditors = data.body.kreditorData.filter((kreditor) =>
		kreditor.nama.toLowerCase().includes(searchKreditor.toLowerCase())
	);

	const handleSelectKreditor = (kreditorId) => {
		selectedKreditor = kreditorId;
		searchKreditor = '';
	};
	$: selectedKreditorData = data.body.kreditorData.find(
		(kreditor) => kreditor.id === selectedKreditor
	);
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
		buktiTagihan = [...buktiTagihan, { tipeDokumenId: '', dokumen: [] }];
	};

	const handleRemoveTagihan = (index) => {
		const list = [...buktiTagihan];
		list.splice(index, 1);
		buktiTagihan = list;
	};

	let loading = false;
	let error = null;
	let success = null;

	let form
	const handleAddKreditor = async (event) => {
		const { target } = event;
		loading = true;
		try {
			const response = await fetch('?/addKreditor', {
				method: 'POST',
				body: new FormData(target)
			});
			const result = deserialize(await response.text());
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
		// loading = true;
		// error = null;
		// success = null;
		const formData = new FormData(event.currentTarget);
		formData.append('kreditorId', selectedKreditor);
		try {
			const response = await fetch('?/addTagihan', {
				method: 'POST',
				body: formData
			});
			const result = deserialize(await response.text());
			form = result;
		} catch (err) {
			console.error(err);
			error = err.message || 'Failed to send email';
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
	{#if data.body.role === 'admin'}
		<h1>Home</h1>
		<h3>List Kreditor</h3>
		<table border="1px solid">
			<tr>
				<th>No</th>
				<th>Nama</th>
				<th>Alamat</th>
				<th>No. Telepon</th>
				<th>Email</th>
				<th>Dokumen</th>
				<th>Aksi</th>
			</tr>
			<tr>
				<td>1</td>
				<td>Kreditor 1</td>
				<td
					>WISMA GKBI, Lt. 39 (d/a CEO SUITE) Jl. Jend Sudirman Kav 28, RT. 14, RW. 1, Bendungan
					Hilir</td
				>
				<td>08128392983</td>
				<td>dummy@gmail.com</td>
				<td><a href={`${data.body.uniquecode}/kreditor1`}>Lihat Dokumen</a></td>
				<td><button>Kirim Email</button></td>
			</tr>
		</table>
		<!-- {:else if loading}
		<p>Loading...</p> -->
		<!-- {:else if error} -->
		<!-- <p style="color: red;">Error: {error.message}</p> -->
	{:else if success}
		<p style="color: green;">{success}</p>
	{:else}
		<Breadcrumb aria-label="Default breadcrumb example" class="mb-2">
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
									class="h-4 w-4 text-gray-500 dark:text-gray-400"
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
								class="block w-full rounded-lg border border-gray-300 bg-gray-50 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
								placeholder="Cari Kreditor..."
							/>
						</div>
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
							<Label for="pertanggal" class="mb-2">Pertanggal</Label>
							<!-- Datepicker -->
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
									<svg
										class="h-4 w-4 text-gray-500 dark:text-gray-400"
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
									datepicker
									datepicker-format="dd MM yyyy"
									datepicker-title="Pertanggal"
									datepicker-autohide
									name="pertanggal"
									type="text"
									class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
									placeholder="Pilih Tanggal"
								/>
							</div>
						</div>
						<div>
							<Label for="hutangPokok" class="mb-2">Hutang Pokok</Label>
							<Input
								type="text"
								name="hutangPokok"
								placeholder="Hutang Pokok"
								bind:value={jumlahTagihan.hutangPokok}
								on:input={() => {
									jumlahTagihan.hutangPokok = formatPrice(jumlahTagihan.hutangPokok);
								}}
							>
								<p slot="left">Rp.</p>
							</Input>
						</div>
						<div>
							<Label for="bunga" class="mb-2">Bunga</Label>
							<Input
								type="text"
								name="bunga"
								placeholder="Bunga"
								bind:value={jumlahTagihan.bunga}
								on:input={() => {
									jumlahTagihan.bunga = formatPrice(jumlahTagihan.bunga);
								}}
							>
								<p slot="left">Rp.</p>
							</Input>
						</div>
						<div>
							<Label for="denda" class="mb-2">Denda</Label>
							<Input
								type="text"
								name="denda"
								placeholder="Denda"
								bind:value={jumlahTagihan.denda}
								on:input={() => {
									jumlahTagihan.denda = formatPrice(jumlahTagihan.denda);
								}}
							>
								<p slot="left">Rp.</p>
							</Input>
						</div>
					</div>
					<div>
						<Label for="total" class="mb-2">Total</Label>
						<Input
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
							<Label for="sifatTagihan" class="mb-2">Sifat/Golongan Tagihan</Label>
							<Select
								id="sifatTagihan"
								class="mt-2"
								name="sifatTagihanId"
								bind:value={sifatTagihan.id}
								placeholder="Pilih Sifat Tagihan"
							>
								{#each data.body.sifatTagihanData as { id, sifat }}
									<option value={id}>{sifat}</option>
								{/each}
							</Select>
						</div>
						<div>
							<Label for="hutangPokok" class="mb-2">Jumlah Tagihan Seluruhnya</Label>
							<Select
								id="jumlahTagihan"
								class="mt-2"
								bind:value={sifatTagihan.jumlahTagihan}
								name="jumlahTagihan"
								placeholder="Pilih Jumlah Tagihan Seluruhnya"
							>
								<option value="Dijamin">Dijamin</option>
								<option value="Tidak Dijamin">Tidak Dijamin</option>
							</Select>
						</div>
					</div>
				</Card>
				<Card size="none" padding="lg">
					<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Kurun Tunggakan</h3>
					<div class="grid gap-4 sm:gap-6 md:grid-cols-2">
						<div>
							<Label for="mulaiTertunggak" class="mb-2">Mulai Tertunggak Sejak</Label>
							<!-- Datepicker -->
							<div class="relative">
								<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
									<svg
										class="h-4 w-4 text-gray-500 dark:text-gray-400"
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
									datepicker
									datepicker-format="dd MM yyyy"
									datepicker-title="Mulai Tertunggak Sejak"
									datepicker-autohide
									type="text"
									name="mulaiTertunggak"
									class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
									placeholder="Pilih Tanggal"
								/>
							</div>
						</div>
						<div>
							<Label for="jumlahHari" class="mb-2">Jumlah Hari Tunggakan</Label>
							<Input
								type="text"
								name="jumlahHari"
								id="jumlahHari"
								bind:value={kurunTunggakan.jumlahHari}
								placeholder="Jumlah Hari Tunggakan"
							/>
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
										defaultClass="disabled:text-gray-400 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
										bind:value={bukti.tipeDokumenId}
										name="tipeDokumenId"
										placeholder="Pilih Sifat/Golongan Tagihan Terlebih Dahulu"
										disabled={sifatTagihan.id === ''}
									>
										{#each data.body.tipeDokumenData as { id, tipe, sifatTagihanId }}
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
										<Button on:click={() => handleAddTagihan()}
											><PlusSolid class="h-5 w-5" /></Button
										>
									{/if}
								</div>
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
										<div class="grid grid-cols-2 gap-2">
											<Button on:click={() => {}}>Change Dokumen</Button>
											<Button on:click={() => handleRemove(index)} color="red"
												>Remove Dokumen</Button
											>
										</div>
									</div>
								{:else}
									<div class="mt-4">
										<div
											role="button"
											tabindex="0"
											aria-label="File Upload"
											class="flex w-full items-center justify-center"
											on:drop={(e) => handleDrop(index, e)}
											on:dragover={handleDragOver}
										>
											<label
												for={`dropzone-file-${index}`}
												class={`${isDragging ? 'border-primary-700' : 'border-gray-300'} dark:hover:bg-bray-800 flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 ${sifatTagihan.id === '' ? '' : 'cursor-pointer hover:bg-gray-100 '} dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
											>
												<div class="flex flex-col items-center justify-center pb-6 pt-5">
													<svg
														class={`mb-4 h-8 w-8 ${sifatTagihan.id === '' ? 'text-gray-300' : 'text-gray-500'} dark:text-gray-400`}
														aria-hidden="true"
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 20 16"
													>
														<path
															stroke="currentColor"
															stroke-linecap="round"
															stroke-linejoin="round"
															stroke-width="2"
															d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
														/>
													</svg>
													<p
														class={`mb-2 text-sm  ${sifatTagihan.id === '' ? 'text-gray-300' : 'text-gray-500'} dark:text-gray-400`}
													>
														<span class="font-semibold">Click to upload</span> or drag and drop
													</p>
													<p
														class={`text-xs ${sifatTagihan.id === '' ? 'text-gray-300' : 'text-gray-500'} dark:text-gray-400`}
													>
														PDF or DOCX (MAX. 800x400px)
													</p>
												</div>
												<input
													id={`dropzone-file-${index}`}
													type="file"
													class="hidden"
													bind:files={dokumen}
													name="dokumen"
													accept=".pdf,"
													disabled={sifatTagihan.id === ''}
												/>
											</label>
										</div>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</Card>
			</div>
			<div class="my-4 flex justify-end">
				<Button type="submit">Submit</Button>
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
				<Label class="space-y-2">
					<span>Nama</span>
					<Input type="text" name="nama" placeholder="Masukkan Nama" />
				</Label>
				<Label class="space-y-2">
					<span>Email</span>
					<Input type="email" name="email" placeholder="Masukkan Email" />
				</Label>
				<Label class="space-y-2">
					<span>No. Telepon</span>
					<Input type="text" name="noTelp" placeholder="Masukkan No Telepon" />
				</Label>
				<Label class="space-y-2">
					<span>Alamat</span>
					<Input type="text" name="alamat" placeholder="Masukkan Alamat" />
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
	{/if}
{:else}
	<h1>Unauthorized</h1>
{/if}
