import { prisma } from '$lib/prisma.server.js';
import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';

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
	const currentUser = await prisma.User.findUnique({
		where: { email: decoded.user.email }
	});
	if (currentUser.roleId !== 1) {
		return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
			status: 403
		});
	}
	const verify = await prisma.Verified.findMany();
	if (!verify) {
		return new Response(
			JSON.stringify({ success: false, code: 404, message: 'Password tidak ditemukan!' }),
			{
				status: 404
			}
		);
	}
	return new Response(JSON.stringify({ success: true, message: 'Berhasil', data: verify }), {
		status: 200
	});
}

export async function POST({ request }) {
	let token = request.headers.get('authorization');
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
		const currentUser = await prisma.User.findUnique({
			where: { email: decoded.user.email }
		});
		if (currentUser.roleId !== 1) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
		if (!password) {
			validation.errors.push({ field: 'password', message: 'Password tidak boleh kosong!' });
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
		const existingData = await prisma.Verified.findMany();
		if (existingData.length >= 1) {
			return new Response(
				JSON.stringify({ success: false, code: 400, message: 'Password hanya boleh satu!' }),
				{ status: 400 }
			);
		} else {
			await prisma.Verified.create({
				data: {
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

export async function PUT({ request }) {
	let token = request.headers.get('authorization');
	const { oldPassword, newPassword, confirmPassword } = await request.json();
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
		const currentUser = await prisma.User.findUnique({
			where: { email: decoded.user.email }
		});
		if (currentUser.roleId !== 1) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
		const oldData = await prisma.Verified.findFirst();
		if (!oldPassword) {
			validation.errors.push({ field: 'oldPassword', message: 'Old password tidak boleh kosong!' });
		}
		if (oldPassword !== oldData.password) {
			validation.errors.push({ field: 'oldPassword', message: 'Old password tidak sesuai!' });
		}
		if (!newPassword) {
			validation.errors.push({ field: 'newPassword', message: 'Password tidak boleh kosong!' });
		}
		if (!confirmPassword) {
			validation.errors.push({
				field: 'confirmPassword',
				message: 'Confirm password tidak boleh kosong!'
			});
		}
		if (newPassword !== confirmPassword) {
			validation.errors.push({
				field: 'confirmPassword',
				message: 'Confirm password tidak sesuai!'
			});
		}
		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation), { status: 400 });
		}
		await prisma.Verified.update({
			where: { id: oldData.id },
			data: {
				password: newPassword
			}
		});
		return new Response(JSON.stringify({ success: true, message: 'Password berhasil diubah!' }), {
			status: 200
		});
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
