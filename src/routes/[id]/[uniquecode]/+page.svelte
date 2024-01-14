<script>
	let tagihan = [
		{
			nama_tagihan: '',
			dokumen: []
		}
	];
	let modal = false;
	let kurator = '';
	let filteredKuratorOptions = [];
	let kuratorOptions = [
		'PT AHA',
		'Kurator2',
		'Kurator3',
		'Kurator4',
		'Kurator5',
		'Kurator6',
		'Kurator7',
		'Kurator8'
	];
	const handleAddTagihan = () => {
		tagihan = [...tagihan, { nama_tagihan: '', dokumen: [] }];
	};

	const handleRemoveTagihan = (index) => {
		const list = [...tagihan];
		list.splice(index, 1);
		tagihan = list;
	};

	const handleAddDokumen = (index) => {
		const list = [...tagihan];
		list[index].dokumen.push({ nama_dokumen: '' });
		tagihan = list;
	};

	const handleRemoveDokumen = (indexdokumen, indextagihan) => {
		const list = [...tagihan];
		list[indextagihan].dokumen.splice(indexdokumen, 1);
		tagihan = list;
	};

	const handleKurator = () => {
		if (kurator.trim() === '') {
			filteredKuratorOptions = [];
		} else {
			filteredKuratorOptions = kuratorOptions.filter((option) =>
				option.toLowerCase().includes(kurator.toLowerCase())
			);
		}
	};

	const handleSubmit = () => {
		const data = {
			kurator,
			tagihan
		};

		console.log('Data yang akan dikirim:', data);
	};
	const showModal = () => {
		modal = true;
	};

	export let data;
</script>

{#if data.status == 200}
	<h1>Form Registrasi</h1>
	<form>
		<label for="kurator">Data Kurator</label>
		<input type="text" name="kurator" id="kurator" bind:value={kurator} on:input={handleKurator} />
		{#if kurator.trim() !== '' && filteredKuratorOptions.length === 0}
			<p>Kurator tidak ditemukan. Silahkan tambahkan kurator terlebih dahulu.</p>
			<button on:click={showModal}>+ Tambah kurator</button>
		{/if}
		{#if filteredKuratorOptions.length > 0}
			<ul>
				{#each filteredKuratorOptions as option (option)}
					<li>{option}</li>
				{/each}
			</ul>
		{/if}
		<br />
		<label for="tagihan">Data Tagihan</label>
		<br />
		{#each tagihan as data, index (data)}
			<div>
				<div>
					<input
						type="text"
						name="tagihan"
						id="tagihan"
						placeholder="Tagihan"
						bind:value={data.nama_tagihan}
					/>
					{#if tagihan.length !== 1}
						<button type="button" on:click={() => handleRemoveTagihan(index)}>-</button>
					{/if}
					{#if tagihan.length - 1 === index}
						<button type="button" on:click={() => handleAddTagihan()}>+ Tambah Tagihan</button>
					{/if}
				</div>
				{#each data.dokumen as dokumen, indexdokumen (dokumen)}
					<div>
						<input
							type="text"
							name="nama_dokumen"
							bind:value={dokumen.nama_dokumen}
							placeholder="Nama Dokumen"
						/>
						<button type="button" on:click={() => handleRemoveDokumen(indexdokumen, index)}
							>-</button
						>
					</div>
				{/each}
				<button type="button" on:click={handleAddDokumen(index)}>+ Tambah Dokumen</button>
			</div>
			<br />
		{/each}
		<button type="submit" on:click={handleSubmit}>submit</button>
	</form>
{:else}
	<h1>Unauthorized</h1>
{/if}
