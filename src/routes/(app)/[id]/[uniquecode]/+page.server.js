import { prisma } from '$lib/prisma.server.js';

export async function load({ params }) {
	const { uniquecode } = params;
	const user = await prisma.users.findUnique({
		where: { uniqueCode: uniquecode }
	});
	if (user) {
		const tagihanData = await prisma.tagihan.findMany();
        const sifatTagihanData = await prisma.sifatTagihan.findMany();
        const kreditorData = await prisma.kreditor.findMany();
        let tagihan = []
        tagihanData.map((data) => {
            let sifatTagihan = sifatTagihanData.find((sifat) => sifat.id === data.sifatTagihanId)
            let kreditor = kreditorData.find((kreditor) => kreditor.id === data.kreditorId)
            let totalTagihan = parseInt(data.hutangPokok)+parseInt(data.denda)+parseInt(data.bunga)
            tagihan.push({
                kreditor : kreditor.nama,
                pertanggal : data.pertanggal,
                totalTagihan,
                sifatTagihan : sifatTagihan.sifat,
                jumlahTagihan : data.jumlahTagihan,
                kurunTunggakan : data.mulaiTertunggak
            })
        })
		return {
			status: 200,
			body: {
				role: user.role,
				uniquecode,
				tagihan,
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