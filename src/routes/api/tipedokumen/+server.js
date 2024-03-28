import { prisma } from '$lib/prisma.server.js';
import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';
export async function GET({ request }) {
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
	const tipeDokumen = await prisma.tipeDokumen.findMany();
	if (!tipeDokumen) {
		return new Response(
			JSON.stringify({ success: false, code: 404, message: 'Tipe dokumen tidak ditemukan!' }),
			{
				status: 404
			}
		);
	}
	return new Response(JSON.stringify({ success: true, message: 'Berhasil', data: tipeDokumen }), {
		status: 200
	});
}
