import { c as create_ssr_component, d as add_attribute, f as each, e as escape } from "../../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let selectedKreditorData;
  let tagihan = [{ nama_tagihan: "", dokumen: [] }];
  let kreditors = [
    {
      nama: "Kreditor 1",
      alamat: "WISMA GKBI, Lt. 39 (d/a CEO SUITE) Jl. Jend Sudirman Kav 28, RT. 14, RW. 1, Bendungan Hilir",
      no_telp: "081…",
      email: "xxx@hhh.com"
    },
    {
      nama: "Kreditor 2",
      alamat: "WISMA GKBI, Lt. 39 (d/a CEO SUITE) Jl. Jend Sudirman Kav 28, RT. 14, RW. 1, Bendungan Hilir",
      no_telp: "081…",
      email: "xxx@hhh.com"
    },
    {
      nama: "Kreditor 3",
      alamat: "WISMA GKBI, Lt. 39 (d/a CEO SUITE) Jl. Jend Sudirman Kav 28, RT. 14, RW. 1, Bendungan Hilir",
      no_telp: "081…",
      email: "xxx@hhh.com"
    }
  ];
  let selectedKreditor = "";
  let jumlahTagihan = {
    pertanggal: "",
    hutangPokok: "",
    bunga: "",
    denda: "",
    totalTagihan: ""
  };
  const tagihanOption = {
    Separatis: {
      dokumen: [
        "Perjanjian Kredit",
        "Sertifikat hak Tanggungan (Fidusia / Hipotik)",
        "Dokumen Kepemilikan (Jaminan)",
        "IMB (Ijin mendirikan Bangunan)",
        "PBB (Pajak Bumi Bangunan)",
        "Somasi",
        "Akte Pendirian Perusahaan",
        "Identitas Direktur",
        "Surat Kuasa"
      ]
    },
    Konkuren: {
      dokumen: [
        "Rincian Tagihan (Invoice)",
        "Faktur",
        "Purchase Order (PO)",
        "Kartu Advokat (Foto Copy)",
        "Bukti Transfer",
        "Perjanjian Hutang/Piutang/Pernyataan Hutang"
      ]
    },
    Preferent: {
      dokumen: [
        "Slip Gaji (bagi karyawan)",
        "Perjanjian Kontrak Kerja",
        "ID Card",
        "Bukti Potong PPH / SPT",
        "Bukti BPJS"
      ]
    }
  };
  let kurunTunggakan = { mulaiTertunggak: "", jumlahHari: "" };
  const jumlahTagihanOption = ["Dijamin", "Tidak Dijamin"];
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  selectedKreditorData = kreditors.find((kreditor) => kreditor.nama === selectedKreditor);
  return `${data.status == 200 ? `${data.body.role === "admin" ? `<h1 data-svelte-h="svelte-1axyf4f">Home</h1> <h3 data-svelte-h="svelte-18uyxya">List Kreditor</h3> <table border="1px solid"><tr data-svelte-h="svelte-19m15hv"><th>No</th> <th>Nama</th> <th>Alamat</th> <th>No. Telepon</th> <th>Email</th> <th>Dokumen</th> <th>Aksi</th></tr> <tr><td data-svelte-h="svelte-17akaub">1</td> <td data-svelte-h="svelte-1gefq3d">Kreditor 1</td> <td data-svelte-h="svelte-csy9yd">WISMA GKBI, Lt. 39 (d/a CEO SUITE) Jl. Jend Sudirman Kav 28, RT. 14, RW. 1, Bendungan
					Hilir</td> <td data-svelte-h="svelte-118o8v1">08128392983</td> <td data-svelte-h="svelte-hy7t6d">dummy@gmail.com</td> <td><a${add_attribute("href", `${data.body.uniquecode}/kreditor1`, 0)}>Lihat Dokumen</a></td> <td data-svelte-h="svelte-1td848t"><button>Kirim Email</button></td></tr></table>` : `<h1 data-svelte-h="svelte-wlolpo">Form Tagihan</h1> <form><h3 for="kreditor" data-svelte-h="svelte-2tl3fz">IDENTITAS KREDITOR</h3> <div style="border: 1px solid; padding: 12px;"><select><option value="" disabled selected data-svelte-h="svelte-1fiwedz">Pilih Kreditor</option>${each(kreditors, (kreditor) => {
    return `<option${add_attribute("value", kreditor.nama, 0)}>${escape(kreditor.nama)}</option>`;
  })}</select> ${selectedKreditorData ? `<div><p>Nama : ${escape(selectedKreditorData.nama)}</p> <p>Alamat : ${escape(selectedKreditorData.alamat)}</p> <p>No. Telepon : ${escape(selectedKreditorData.no_telp)}</p> <p>Email : ${escape(selectedKreditorData.email)}</p></div>` : ``}</div> <h3 data-svelte-h="svelte-mxu29r">JUMLAH TAGIHAN</h3> <div style="border: 1px solid; padding: 12px;"><label for="pertanggal" data-svelte-h="svelte-1pgyj14">Pertanggal :</label> <input type="date" name="pertanggal" id="pertanggal"${add_attribute("value", jumlahTagihan.pertanggal, 0)}> <br> <label for="hutangPokok" data-svelte-h="svelte-2m0hxm">Hutang Pokok : Rp.</label> <input type="text" name="hutangPokok" id="hutangPokok"${add_attribute("value", jumlahTagihan.hutangPokok, 0)}> <br> <label for="bunga" data-svelte-h="svelte-1auucyy">Bunga : Rp.</label> <input type="text" name="bunga" id="bunga"${add_attribute("value", jumlahTagihan.bunga, 0)}> <br> <label for="denda" data-svelte-h="svelte-1uylqyo">Denda : Rp.</label> <input type="text" name="denda" id="denda"${add_attribute("value", jumlahTagihan.denda, 0)}> <br> <label for="total" data-svelte-h="svelte-2xhrw">Total : Rp.</label> <input type="text" name="total" id="total"${add_attribute("value", jumlahTagihan.totalTagihan, 0)}></div> <h3 data-svelte-h="svelte-1o1tkpd">SIFAT/GOLONGAN TAGIHAN</h3> <div style="border: 1px solid; padding: 12px;"><label for="sifatTagihan" data-svelte-h="svelte-14j9o22">Sifat/Golongan Tagihan :</label> <select name="sifatTagihan" id="sifatTagihan"><option value="" disabled selected data-svelte-h="svelte-qfjjuk">Pilih Sifat Tagihan</option>${each(Object.keys(tagihanOption), (sifatTagihan) => {
    return `<option${add_attribute("value", sifatTagihan, 0)}>${escape(sifatTagihan)}</option>`;
  })}</select> <br> <label for="jumlahTagihan" data-svelte-h="svelte-9xkf54">Jumlah Tagihan Seluruhnya :</label> <select name="jumlahTagihan" id="jumlahTagihan"><option value="" disabled selected data-svelte-h="svelte-vqom4m">Pilih Jumlah Tagihan Seluruhnya</option>${each(jumlahTagihanOption, (jumlahTagihan2) => {
    return `<option${add_attribute("value", jumlahTagihan2, 0)}>${escape(jumlahTagihan2)}</option>`;
  })}</select></div> <h3 data-svelte-h="svelte-z0pcc3">KURUN TUNGGAKAN</h3> <div style="border: 1px solid; padding: 12px;"><label for="mulaiTertunggak" data-svelte-h="svelte-1oiebz6">Mulai Tertunggak sejak :</label> <input type="date" name="mulaiTertunggak" id="mulaiTertunggak"${add_attribute("value", kurunTunggakan.mulaiTertunggak, 0)}> <br> <label for="jumlahHari" data-svelte-h="svelte-1frp1ua">Jumlah Hari Tunggakan :</label> <input type="text" name="jumlahHari" id="jumlahHari"${add_attribute("value", kurunTunggakan.jumlahHari, 0)}></div> <h3 data-svelte-h="svelte-a2bjmt">DAFTAR BUKTI TAGIHAN ( foto copy )</h3> <div style="border: 1px solid; padding: 12px;">${each(tagihan, (data2, index) => {
    return `<div><select><option value="" disabled selected data-svelte-h="svelte-19t9mdn">Pilih Sifat/Golongan Tagihan Terlebih Dahulu</option>${``}</select> ${tagihan.length !== 1 ? `<button type="button" data-svelte-h="svelte-1aavtq5">-</button>` : ``} ${tagihan.length - 1 === index ? `<button type="button" data-svelte-h="svelte-1dx5gyt">+ Tambah Tagihan</button>` : ``} <br> ${each(data2.dokumen, (dokumen, indexdokumen) => {
      return `<div><input type="text" name="nama_dokumen" placeholder="Dokumen"${add_attribute("value", dokumen.nama_dokumen, 0)}> <button type="button" data-svelte-h="svelte-1s2010e">-</button> </div>`;
    })} <button type="button" data-svelte-h="svelte-acub09">+ Tambah Dokumen</button> </div>`;
  })}</div> <br> <button type="submit" data-svelte-h="svelte-1fr5tlj">submit</button></form>`}` : `<h1 data-svelte-h="svelte-pf9ywm">Unauthorized</h1>`}`;
});
export {
  Page as default
};
