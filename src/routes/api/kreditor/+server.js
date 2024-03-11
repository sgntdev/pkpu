import { prisma } from '$lib/prisma.server.js';

export async function GET({ request }) {
	let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
	try {
		const kreditors = await prisma.kreditor.findMany();
		return new Response(JSON.stringify(kreditors), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Invalid JWT token' }), { status: 401 });
	}
}

export async function POST({ request }) {
	const data = await request.json();
	const { userId, nama, email, noTelp, alamat } = data;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const validation = {
		success: false,
		errors: []
	};

	try {
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
			return new Response(JSON.stringify(validation));
		}
		await prisma.kreditor.create({
			data: {
				userId,
				nama,
				email,
				noTelp,
				alamat
			}
		});

		return new Response(
			JSON.stringify({ success: true, message: 'Kreditor berhasil ditambahkan' })
		);
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ success: false, message: 'Kreditor gagal ditambahkan' }));
	}
}
