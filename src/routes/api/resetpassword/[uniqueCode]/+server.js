import { SECRET_INGREDIENT } from '$env/static/private';
import { prisma } from '$lib/prisma.server.js';
import jwt from 'jsonwebtoken';

export async function PUT({ request, params }) {
	let token = request.headers.get('authorization');
    const uniqueCode = params.uniqueCode;
	const { password, confirmPassword } = await request.json();
	const validation = {
		success: false,
		errors: []
	};
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ success: false, code: 401, message: 'Unauthorized' }), {
			status: 401
		});
	}
	try {
		let decoded = jwt.verify(token, SECRET_INGREDIENT);
		if (decoded.user.roleId !== 1 && decoded.user.roleId !== 2) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
		if (!password) {
			validation.errors.push({ field: 'password', message: 'Password tidak boleh kosong!' });
		}
		if (password.length < 8) {
			validation.errors.push({ field: 'password', message: 'Password minimal 8 karakter!' });
		}
		if (!confirmPassword) {
			validation.errors.push({
				field: 'confirmPassword',
				message: 'Confirm password tidak boleh kosong!'
			});
		}
		if (password !== confirmPassword) {
			validation.errors.push({
				field: 'confirmPassword',
				message: 'Confirm password tidak sesuai!'
			});
		}
		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation), { status: 400 });
		}
		const existingPassword = await prisma.VerifiedPassword.findUnique({
			where: { uniqueCode }
		});
		if (!existingPassword) {
			return new Response(
				JSON.stringify({ success: false, code: 404, message: 'Password tidak ditemukan!' }),
				{ status: 404 }
			);
		} else {
			await prisma.VerifiedPassword.update({
				where: { id: existingPassword.id },
				data: {
					password,
					uniqueCode: null,
					expirationDate: null
				}
			});
			return new Response(JSON.stringify({ success: true, message: 'Password berhasil diubah!' }), {
				status: 200
			});
		}
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				code: 500,
				message: 'Password gagal diubah!'
			}),
			{ status: 500 }
		);
	}
}
