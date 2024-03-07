import { prisma } from '$lib/prisma.server.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
	const kreditorId = parseInt(params.kreditorid);
	const tagihanData = await prisma.tagihan.findMany({
		where: { kreditorId }
	});
	const sifatTagihanData = await prisma.sifatTagihan.findMany();
	// const kreditorData = await prisma.kreditor.findMany();
	// let kreditor = kreditorData.find((kreditor) => kreditor.id === kreditorId);
	let tagihan = [];
	tagihanData.map((data) => {
		let sifatTagihan = sifatTagihanData.find((sifat) => sifat.id === data.sifatTagihanId);
		let totalTagihan = parseInt(data.hutangPokok) + parseInt(data.denda) + parseInt(data.bunga);
		tagihan.push({
            id:data.id,
			pertanggal: data.pertanggal,
			totalTagihan,
			sifatTagihan: sifatTagihan.sifat,
			jumlahTagihan: data.jumlahTagihan,
			kurunTunggakan: data.mulaiTertunggak
		});
	});
	return new Response(JSON.stringify(tagihan));
}
