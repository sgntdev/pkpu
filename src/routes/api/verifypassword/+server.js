import { prisma } from '$lib/prisma.server.js';
import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';

export async function POST({ request }) {
	let token = request.headers.get('authorization');
	const data = await request.json();
	const { password, confirmPassword } = data;
	const userId = parseInt(data.userId);
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
		const existingData = await prisma.VerifiedPassword.findUnique({
			where: {
				userId
			}
		});
		if (existingData) {
			return new Response(
				JSON.stringify({ success: false, code: 400, message: 'Password hanya boleh satu!' }),
				{ status: 400 }
			);
		} else {
			await prisma.VerifiedPassword.create({
				data: {
					userId,
					password
				}
			});
			return new Response(
				JSON.stringify({ success: true, message: 'Password berhasil disimpan!' }),
				{ status: 200 }
			);
		}
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				code: 500,
				message: 'Password gagal disimpan!'
			}),
			{ status: 500 }
		);
	}
}