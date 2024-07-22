import { prisma } from '$lib/prisma.server.js';
import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';

export async function GET({ params, request }) {
	let token = request.headers.get('authorization');
	const tagihanId = parseInt(params.tagihanid);
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ success: false, code: 401, message: 'Unauthorized' }), {
			status: 401
		});
	}
	let decoded = jwt.verify(token, SECRET_INGREDIENT);
	if (decoded.user.roleId !== 1 && decoded.user.roleId !== 2) {
		return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
			status: 403
		});
	}
	const tagihanItem = await prisma.tagihanItem.findMany({ where: { tagihanId } });
	if (!tagihanItem) {
		return new Response(
			JSON.stringify({ success: false, code: 404, message: 'Tagihan Item tidak ditemukan!' }),
			{
				status: 404
			}
		);
	}
	return new Response(
		JSON.stringify({ success: true, message: 'Berhasil', data: tagihanItem }, { status: 200 })
	);
}
