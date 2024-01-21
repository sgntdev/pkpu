<script>
	let verifyStatus = false;

    const handleVerify = () => {
        verifyStatus = !verifyStatus
    }
</script>

<h1>Halaman Tagihan</h1>
<div>
	<h3 for="kreditor">IDENTITAS KREDITOR</h3>
	<div style="border: 1px solid; padding: 12px;">
		<p>Nama : Kreditor 1</p>
		<p>
			Alamat : WISMA GKBI, Lt. 39 (d/a CEO SUITE) Jl. Jend Sudirman Kav 28, RT. 14, RW. 1, Bendungan
			Hilir
		</p>
		<p>No. Telepon : 08128392983</p>
		<p>Email : dummy@gmail.com</p>
	</div>
	<h3>JUMLAH TAGIHAN</h3>
	<div style="border: 1px solid; padding: 12px;">
		<p>Pertanggal : 17 Agustus 2023</p>
		<p>Hutang Pokok : Rp. 3.000.000</p>
		<p>Bunga : Rp. 5.000.000</p>
		<p>Denda : Rp. 2.000.000</p>
		<p>Total : Rp. 10.000.000</p>
	</div>
	<h3>SIFAT/GOLONGAN TAGIHAN</h3>
	<div style="border: 1px solid; padding: 12px;">
		<p>Sifat/Golongan Tagihan : Preferent</p>
		<p>Jumlah Tagihan Seluruhnya : Dijamin</p>
	</div>
	<h3>KURUN TUNGGAKAN</h3>
	<div style="border: 1px solid; padding: 12px;">
		<p>Mulai Tertunggak sejak : 11 Desember 2018</p>
		<p>Jumlah Hari Tunggakan : 1.740 Hari</p>
	</div>
	<h3>DAFTAR BUKTI TAGIHAN ( foto copy )</h3>
	<div style="border: 1px solid; padding: 12px;">
		<p>1. Slip Gaji</p>
		<p>2. ID Card</p>
		<p>3. Bukti BPJS</p>
	</div>
    {#if verifyStatus}
    <img src="/verified-icon.svg" alt="verified-icon" style="width: 96px; height: 96px; margin : 24px 0px">
    {/if}
	<br />
	<button on:click={handleVerify}>{verifyStatus ? 'Unverify' : 'Verify'}</button>
</div>
