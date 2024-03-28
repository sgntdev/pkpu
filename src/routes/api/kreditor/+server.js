import { prisma } from '$lib/prisma.server.js';
import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';

export async function GET({ request }) {
	let token = request.headers.get('authorization');
	const url = new URL(request.url);
	const userId = url.searchParams.get('userId');
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
	let kreditorQuery = {
		where: {},
		orderBy: {
			id: 'asc'
		}
	};

	if (userId) {
		kreditorQuery.where.userId = parseInt(userId);
	}

	const kreditors = await prisma.kreditor.findMany(kreditorQuery);

	if (!kreditors) {
		return new Response(
			JSON.stringify({ success: false, code: 404, message: 'Kreditor tidak ditemukan!' }),
			{
				status: 404
			}
		);
	}
	return new Response(JSON.stringify({ success: true, message: 'Berhasil', data: kreditors }), {
		status: 200
	});
}

export async function POST({ request }) {
	let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ success: false, code: 401, message: 'Unauthorized' }), {
			status: 401
		});
	}
	const data = await request.json();
	const { userId, nama, email, noTelp, alamat } = data;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const validation = {
		success: false,
		errors: []
	};

	try {
		let decoded = jwt.verify(token, SECRET_INGREDIENT);
		if (!decoded) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
		if (!nama) {
			validation.errors.push({ field: 'nama', message: 'Nama tidak boleh kosong!' });
		}
		if (!email) {
			validation.errors.push({ field: 'email', message: 'Email tidak boleh kosong!' });
		} else if (!emailRegex.test(email)) {
			validation.errors.push({ field: 'email', message: 'Format email tidak valid!' });
		}
		if (!noTelp) {
			validation.errors.push({ field: 'noTelp', message: 'No Telepon tidak boleh kosong!' });
		}
		if (!alamat) {
			validation.errors.push({ field: 'alamat', message: 'Alamat tidak boleh kosong!' });
		}
		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation), { status: 400 });
		}
		const kreditor = await prisma.kreditor.create({
			data: {
				userId,
				nama,
				email,
				noTelp,
				alamat
			}
		});
		return new Response(
			JSON.stringify({ success: true, message: 'Kreditor berhasil ditambahkan!', data: kreditor }),
			{
				status: 200
			}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, code: 500, message: 'Kreditor gagal ditambahkan!' }),
			{ status: 500 }
		);
	}
}
