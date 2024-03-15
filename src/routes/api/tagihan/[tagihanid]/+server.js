import { prisma } from '$lib/prisma.server.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, request }) {
	let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
	try {
		const tagihanId = parseInt(params.tagihanid);
		const tagihan = await prisma.tagihan.findUnique({
			where: { id: tagihanId }
		});
		const sifattagihan = await prisma.sifatTagihan.findMany();
		const kreditorData = await prisma.kreditor.findMany();

		let kreditor = kreditorData.find((kreditor) => kreditor.id === tagihan.kreditorId);
		let sifatTagihan = sifattagihan.find((sifat) => sifat.id === tagihan.sifatTagihanId).sifat;
		let totalTagihan =
			parseInt(tagihan.hutangPokok) + parseInt(tagihan.denda) + parseInt(tagihan.bunga);
		let data = {
			kreditor,
			pertanggal: tagihan.pertanggal,
			hutangPokok: tagihan.hutangPokok,
			bunga: tagihan.bunga,
			denda: tagihan.denda,
			totalTagihan,
			jumlahTagihan: tagihan.jumlahTagihan,
			sifatTagihan,
			mulaiTertunggak: tagihan.mulaiTertunggak,
			jumlahHari: tagihan.jumlahHari,
			statusTagihan : tagihan.status
		};
		return new Response(JSON.stringify(data));
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Error Unexpected' }), { status: 400 });
	}
}

export async function PUT({ params, request }) {
	let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
	const tagihanId = parseInt(params.tagihanid);
	const data = await request.json();
	const validation = {
		success: false,
		errors: []
	};
	try {
		if (!data.tagihanStatus) {
			validation.errors.push({
				field: 'tagihanStatus',
				message: 'Status tagihan tidak boleh kosong!'
			});
		}
		if (!data.password) {
			validation.errors.push({ field: 'password', message: 'Password tidak boleh kosong!' });
		}
		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation));
		}
		const verify = await prisma.verified.findFirst();
		if(verify === null){
			return new Response(JSON.stringify({ success: false, message: 'Password verify tidak ditemukan!' }), {
				status: 400
			});
		}
		if (data.password !== verify.password) {
			return new Response(JSON.stringify({ success: false, message: 'Password verify salah!' }), {
				status: 400
			});
		} else {
			await prisma.Tagihan.update({
				where: { id : tagihanId},
				data: {
					status: parseInt(data.tagihanStatus)
				}
			});
			return new Response(JSON.stringify({ success: true, message: 'Proses verify berhasil!' }), {
				status: 200
			});
		}
	} catch (error) {
		return new Response(JSON.stringify({  success: false, message: 'Error Unexpected' }), { status: 400 });
	}
}
