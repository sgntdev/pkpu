<script>
	let tagihan = [
		{
			nama_tagihan: '',
			dokumen: []
		}
	];
	let kreditors = [
		{
			nama: 'Kreditor 1',
			alamat: 'Jl. Merdeka No. 123, Jakarta',
			no_telp: '081234567890',
			email: 'budi.santoso@email.com'
		},
		{
			nama: 'Kreditor 2',
			alamat: 'Jl. Kebon Baru No. 45, Bandung',
			no_telp: '085623456789',
			email: 'ani.cahyani@email.com'
		},
		{
			nama: 'Kreditor 3',
			alamat: 'Jl. Pahlawan Timur No. 67, Surabaya',
			no_telp: '082187654321',
			email: 'rahman.subrata@email.com'
		}
	];
	let selectedKreditor = '';

	$: selectedKreditorData = kreditors.find((kreditor) => kreditor.nama === selectedKreditor);

	let jumlahTagihan = {
		pertanggal: '',
		hutangPokok: '',
		bunga: '',
		denda: '',
		totalTagihan: ''
	};
	const tagihanOption = {
		Separatis: {
			dokumen: [
				'Perjanjian Kredit',
				'Sertifikat hak Tanggungan (Fidusia / Hipotik)',
				'Dokumen Kepemilikan (Jaminan)',
				'IMB (Ijin mendirikan Bangunan)',
				'PBB (Pajak Bumi Bangunan)',
				'Somasi',
				'Akte Pendirian Perusahaan',
				'Identitas Direktur',
				'Surat Kuasa'
			]
		},
		Konkuren: {
			dokumen: [
				'Rincian Tagihan (Invoice)',
				'Faktur',
				'Purchase Order (PO)',
				'Kartu Advokat (Foto Copy)',
				'Bukti Transfer',
				'Perjanjian Hutang/Piutang/Pernyataan Hutang'
			]
		},
		Preferent: {
			dokumen: [
				'Slip Gaji (bagi karyawan)',
				'Perjanjian Kontrak Kerja',
				'ID Card',
				'Bukti Potong PPH / SPT',
				'Bukti BPJS'
			]
		}
	};
	let sifatTagihan = {
		sifat: '',
		jumlahTagihan: ''
	};
	let kurunTunggakan = {
		mulaiTertunggak: '',
		jumlahHari: ''
	};
	const jumlahTagihanOption = ['Dijamin', 'Tidak Dijamin'];

	//inputan dinamis
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

	let loading = false;
	let error = null;
	let success = null;

	const handleSubmit = async (event) => {
		loading = true;
		error = null;
		success = null;

		try {
			const response = await fetch('?/sendEmail', {
				method: 'POST',
				body: JSON.stringify({
					selectedKreditorData,
					jumlahTagihan,
					sifatTagihan,
					kurunTunggakan,
					tagihan
				})
			});

			const result = await response.json();

			if (response.ok) {
				success = 'Email berhasil dikirim';
			} else {
				throw new Error(result.error || 'Something went wrong');
			}
		} catch (err) {
			console.error(err);
			error = err.message || 'Failed to send email';
		} finally {
			loading = false;
		}
	};

	export let data;
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
	{:else if loading}
		<p>Loading...</p>
	{:else if error}
		<p style="color: red;">Error: {error}</p>
	{:else if success}
		<p style="color: green;">{success}</p>
	{:else}
		<h1>Form Tagihan</h1>
		<form on:submit={handleSubmit}>
			<h3 for="kreditor">IDENTITAS KREDITOR</h3>
			<div style="border: 1px solid; padding: 12px;">
				<select bind:value={selectedKreditor}>
					<option value="" disabled selected>Pilih Kreditor</option>
					{#each kreditors as kreditor}
						<option value={kreditor.nama}>{kreditor.nama}</option>
					{/each}
				</select>
				{#if selectedKreditorData}
					<div>
						<p>Nama : {selectedKreditorData.nama}</p>
						<p>Alamat : {selectedKreditorData.alamat}</p>
						<p>No. Telepon : {selectedKreditorData.no_telp}</p>
						<p>Email : {selectedKreditorData.email}</p>
					</div>
				{/if}
			</div>
			<h3>JUMLAH TAGIHAN</h3>
			<div style="border: 1px solid; padding: 12px;">
				<label for="pertanggal">Pertanggal : </label>
				<input
					type="date"
					name="pertanggal"
					id="pertanggal"
					bind:value={jumlahTagihan.pertanggal}
				/>
				<br />
				<label for="hutangPokok">Hutang Pokok : Rp.</label>
				<input
					type="text"
					name="hutangPokok"
					id="hutangPokok"
					bind:value={jumlahTagihan.hutangPokok}
				/>
				<br />
				<label for="bunga">Bunga : Rp.</label>
				<input type="text" name="bunga" id="bunga" bind:value={jumlahTagihan.bunga} />
				<br />
				<label for="denda">Denda : Rp.</label>
				<input type="text" name="denda" id="denda" bind:value={jumlahTagihan.denda} />
				<br />
				<label for="total">Total : Rp.</label>
				<input type="text" name="total" id="total" bind:value={jumlahTagihan.totalTagihan} />
			</div>
			<h3>SIFAT/GOLONGAN TAGIHAN</h3>
			<div style="border: 1px solid; padding: 12px;">
				<label for="sifatTagihan">Sifat/Golongan Tagihan : </label>
				<select name="sifatTagihan" id="sifatTagihan" bind:value={sifatTagihan.sifat}>
					<option value="" disabled selected>Pilih Sifat Tagihan</option>
					{#each Object.keys(tagihanOption) as sifatTagihan}
						<option value={sifatTagihan}>{sifatTagihan}</option>
					{/each}
				</select>
				<br />
				<label for="jumlahTagihan">Jumlah Tagihan Seluruhnya : </label>
				<select name="jumlahTagihan" id="jumlahTagihan" bind:value={sifatTagihan.jumlahTagihan}>
					<option value="" disabled selected>Pilih Jumlah Tagihan Seluruhnya</option>
					{#each jumlahTagihanOption as jumlahTagihan (jumlahTagihan)}
						<option value={jumlahTagihan}>{jumlahTagihan}</option>
					{/each}
				</select>
			</div>
			<h3>KURUN TUNGGAKAN</h3>
			<div style="border: 1px solid; padding: 12px;">
				<label for="mulaiTertunggak">Mulai Tertunggak sejak : </label>
				<input
					type="date"
					name="mulaiTertunggak"
					id="mulaiTertunggak"
					bind:value={kurunTunggakan.mulaiTertunggak}
				/>
				<br />
				<label for="jumlahHari">Jumlah Hari Tunggakan : </label>
				<input
					type="text"
					name="jumlahHari"
					id="jumlahHari"
					bind:value={kurunTunggakan.jumlahHari}
				/>
			</div>
			<h3>DAFTAR BUKTI TAGIHAN ( foto copy )</h3>
			<div style="border: 1px solid; padding: 12px;">
				{#each tagihan as data, index (data)}
					<div>
						<select bind:value={data.nama_tagihan}>
							<option value="" disabled selected
								>Pilih Sifat/Golongan Tagihan Terlebih Dahulu</option
							>
							{#if sifatTagihan.sifat !== ''}
								{#each tagihanOption[sifatTagihan.sifat].dokumen as dokumen}
									<option value={dokumen}>{dokumen}</option>
								{/each}
							{/if}
						</select>
						{#if tagihan.length !== 1}
							<button type="button" on:click={() => handleRemoveTagihan(index)}>-</button>
						{/if}
						{#if tagihan.length - 1 === index}
							<button type="button" on:click={() => handleAddTagihan()}>+ Tambah Tagihan</button>
						{/if}
						<br />
						{#each data.dokumen as dokumen, indexdokumen (dokumen)}
							<div>
								<input
									type="text"
									name="nama_dokumen"
									bind:value={dokumen.nama_dokumen}
									placeholder="Dokumen"
								/>
								<button type="button" on:click={() => handleRemoveDokumen(indexdokumen, index)}
									>-</button
								>
							</div>
						{/each}
						<button type="button" on:click={handleAddDokumen(index)}>+ Tambah Dokumen</button>
					</div>
				{/each}
			</div>
			<br />
			<button type="submit" on:click={handleSubmit}>submit</button>
		</form>
	{/if}
{:else}
	<h1>Unauthorized</h1>
{/if}
