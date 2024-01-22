import { EMAIL_1, EMAIL_2 } from '$env/static/private';
import transporter from '$lib/emailSetup.server.js';

const defaultData = [
	{
		email: EMAIL_1,
		uniquecode: 'fd82ja73h214db33',
		role: 'admin'
	},
	{
		email: EMAIL_2,
		uniquecode: 'k8d1d21hen1w43d',
		role: 'user'
	}
];

export function load({ params }) {
	const { uniquecode } = params;
	const user = defaultData.find((item) => item.uniquecode === uniquecode);
	if (user) {
		return {
			status: 200,
			body: {
				role: user.role,
				uniquecode: uniquecode
			}
		};
	} else {
		return {
			status: 400,
			body: {
				error: 'Invalid uniquecode'
			}
		};
	}
}

export const actions = {
	sendEmail: async ({ params, request }) => {
		const { uniquecode } = params;
		try {
			const body = await request.json();
			const { selectedKreditorData, jumlahTagihan, sifatTagihan, kurunTunggakan, tagihan } = body;
			const user = defaultData.find((item) => item.uniquecode === uniquecode);
			const email = user.email;
			const kreditorHtml = `
  <h3>DATA KREDITOR</h3>
  <p>Nama : ${selectedKreditorData.nama}</p>
  <p>Alamat : Rp. ${selectedKreditorData.alamat}</p>
  <p>No.Telepon : ${selectedKreditorData.no_telp}</p>
  <p>Email : ${selectedKreditorData.email}</p>
`;
			const jumlahTagihanHtml = `
  <h3>JUMLAH TAGIHAN</h3>
  <p>Pertanggal : ${jumlahTagihan.pertanggal}</p>
  <p>Hutang Pokok : Rp. ${jumlahTagihan.hutangPokok}</p>
  <p>Bunga : ${jumlahTagihan.bunga}</p>
  <p>Denda : ${jumlahTagihan.denda}</p>
  <p>Total : ${jumlahTagihan.totalTagihan}</p>
`;
			const sifatTagihanHtml = `
  <h3>SIFAT TAGIHAN</h3>
  <p>Sifat/Golongan Tagihan : ${sifatTagihan.sifatTagihan}</p>
  <p>Jumlah Tagihan Seluruhnya: ${sifatTagihan.jumlahTagihan}</p>
`;
			const kurunTunggakanHtml = `
  <h3>KURUN TUNGGAKAN</h3>
  <p>Mulai tertunggak sejak : ${kurunTunggakan.mulaiTertunggak}</p>
  <p>Jumlah hari tunggakan : ${kurunTunggakan.jumlahHari}</p>
`;
			const tagihanHtml = `
			<h3>DAFTAR BUKTI TAGIHAN</h3>
			<ul>
			  ${tagihan.map((item, index) => `<li>${index + 1}. ${item.nama_tagihan}</li>`).join('')}
			</ul>
`;
			let html = `<h2>DATA TAGIHAN</h2>`;
			html += kreditorHtml;
			html += jumlahTagihanHtml;
			html += sifatTagihanHtml;
			html += kurunTunggakanHtml;
			html += tagihanHtml;

			const message = {
				from: '"pkpu.co.id" <fotoarchive8@gmail.com>',
				to: email,
				bcc: 'www.pkpu.co.id',
				subject: 'Tanda Terima Tagihan',
				text: 'INI BODY',
				html: html
			};

			const sendEmail = async (message) => {
				await new Promise((resolve, reject) => {
					transporter.sendMail(message, (err, info) => {
						if (err) {
							console.error(err);
							reject(err);
						} else {
							resolve(info);
						}
					});
				});
			};

			await sendEmail(message);

			return {
				success: 'Email is sent'
			};
		} catch (error) {
			console.error(error);
		}
	}
};
