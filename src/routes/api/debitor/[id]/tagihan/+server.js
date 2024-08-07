import { prisma } from '$lib/prisma.server.js';
import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';

export async function GET({ params, request }) {
	const debitorId = parseInt(params.id);
	const url = new URL(request.url);
	const userId = url.searchParams.get('userId');
	let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
	let decoded = jwt.verify(token, SECRET_INGREDIENT);
	if (!decoded) {
		return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
			status: 403
		});
	}
	let tagihanQuery = {
		where: { debitorId },
		orderBy: {
			id: 'asc'
		},
		include: {
			Kreditor: {
				select: {
					nama: true
				}
			},
			SifatTagihan: {
				select: {
					sifat: true
				}
			}
		}
	};

	if (userId) {
		tagihanQuery.where.userId = parseInt(userId);
	}

	const tagihan = await prisma.tagihan.findMany(tagihanQuery);
	const formattedData = tagihan.map((data) => {
		return {
			id: data.id,
			debitorId: data.debitorId,
			userId: data.userId,
			pertanggal: data.pertanggal,
			hutangPokok: data.hutangPokok,
			bunga: data.bunga,
			denda: data.denda,
			jumlahTagihan: data.jumlahTagihan,
			mulaiTertunggak: data.mulaiTertunggak,
			jumlahHari: data.jumlahHari,
			status: data.status,
			namaKreditor: data.Kreditor.nama,
			sifatTagihan: data.SifatTagihan.sifat
		};
	});
	if (!tagihan) {
		return new Response(
			JSON.stringify({ success: false, code: 404, message: 'Tagihan tidak ditemukan!' }),
			{
				status: 404
			}
		);
	}
	return new Response(JSON.stringify({ success: true, message: 'Berhasil', data: formattedData }), {
		status: 200
	});
}
