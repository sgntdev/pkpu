import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';
import { prisma } from '$lib/prisma.server.js';
export async function GET({ request }) {
	let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ success: false, code: 401, message: 'Unauthorized' }), {
			status: 401
		});
	}
	let decoded = jwt.verify(token, SECRET_INGREDIENT);
	if (!decoded) {
		return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
			status: 403
		});
	}
	const role = await prisma.role.findMany();
	if (!role) {
		return new Response(
			JSON.stringify({ success: false, code: 404, message: 'Role tidak ditemukan!' }),
			{
				status: 404
			}
		);
	}
	return new Response(JSON.stringify({ success: true, message: 'Berhasil', data: role }));
}
