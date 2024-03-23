import { prisma } from '$lib/prisma.server.js';
import { del } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN, SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';

export async function DELETE({ params, request }) {
	const id = parseInt(params.id);
    let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
	try {
        let decoded = jwt.verify(token, SECRET_INGREDIENT);
		const currentUser = await prisma.User.findUnique({
			where: { email: decoded.user.email }
		});
		if (!currentUser) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
		const selectedDokumen = await prisma.DokumenTagihan.findUnique({
			where: { id }
		});
		if (selectedDokumen) {
			await del(selectedDokumen.dokumen_url, { token: BLOB_READ_WRITE_TOKEN });
			await prisma.DokumenTagihan.delete({
				where: { id }
			});
		}
		return new Response(
			JSON.stringify({
				success: true,
				message: 'Bukti Tagihan berhasil dihapus!'
			}),
			{ status: 200 }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Bukti Tagihan gagal dihapus!'
			}),
			{ status: 400 }
		);
	}
}
