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
			jumlahHari: tagihan.jumlahHari
		};
		return new Response(JSON.stringify(data));
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Error Unexpected' }), { status: 401 });
	}
}
