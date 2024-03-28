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
	const tagihan = await prisma.tagihan.findMany({
		where: { debitorId, userId: parseInt(userId) },
		orderBy: {
			id: 'asc'
		},
		include: {
			Kreditor: {
				select: {
					nama: true
				}
			},
			sifatTagihan: {
				select: {
					sifat: true
				}
			}
		}
	});
	if (!tagihan) {
		return new Response(
			JSON.stringify({ success: false, code: 404, message: 'Tagihan tidak ditemukan!' }),
			{
				status: 404
			}
		);
	}
	return new Response(JSON.stringify({ success: true, message: 'Berhasil', data: tagihan }), {
		status: 200
	});
}
