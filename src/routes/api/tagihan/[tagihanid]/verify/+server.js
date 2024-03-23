import { prisma } from '$lib/prisma.server.js';
import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';

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
		let decoded = jwt.verify(token, SECRET_INGREDIENT);
		const currentUser = await prisma.User.findUnique({
			where: { email: decoded.user.email }
		});
		if (currentUser.roleId !== 1) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
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
		if (verify === null) {
			return new Response(
				JSON.stringify({ success: false, message: 'Password verify tidak ditemukan!' }),
				{
					status: 400
				}
			);
		}
		if (data.password !== verify.password) {
			return new Response(JSON.stringify({ success: false, message: 'Password verify salah!' }), {
				status: 400
			});
		} else {
			await prisma.Tagihan.update({
				where: { id: tagihanId },
				data: {
					status: parseInt(data.tagihanStatus)
				}
			});
			const tagihanJoin = await prisma.Tagihan.findUnique({
				where: { id: tagihanId },
				include: {
					Debitor: true,
					sifatTagihan: true,
					Kreditor: true,
					DokumenTagihan: {
						include: {
							TipeDokumen: {
								select: {
									tipe: true
								}
							}
						}
					}
				}
			});
			return new Response(
				JSON.stringify({ success: true, message: 'Proses verify berhasil!', data: tagihanJoin }),
				{
					status: 200
				}
			);
		}
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, code: 400, message: 'Error Unexpected' }),
			{ status: 400 }
		);
	}
}
