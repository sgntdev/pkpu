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
	if (decoded.user.roleId !== 1) {
		return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
			status: 403
		});
	}
	const tagihanItem = await prisma.tagihanItem.findMany();
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
	const validation = {
		success: false,
		errors: []
	};
	try {
		let decoded = jwt.verify(token, SECRET_INGREDIENT);
		if (decoded.user.roleId !== 1) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
		for (let i = 0; i < data.length; i++) {
			const dataSpesifik = data[i];
			if (!dataSpesifik.tipe) {
				validation.errors.push({ field: `tipe.${i}`, message: 'Tipe tidak boleh kosong!' });
			}
			if (!dataSpesifik.sifatTagihanId) {
				validation.errors.push({
					field: `sifatTagihanId.${i}`,
					message: 'Sifat Tagihan tidak boleh kosong!'
				});
			}
			if (!dataSpesifik.amount) {
				validation.errors.push({ field: `amount.${i}`, message: 'Amount tidak boleh kosong!' });
			} else if (isNaN(parseFloat(dataSpesifik.amount))) {
				validation.errors.push({ field: `amount.${i}`, message: 'Amount harus berupa angka!' });
			}
		}
		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation), { status: 400 });
		}
		const createdData = await prisma.tagihanItem.createMany({
			data
		});
		return new Response(
			JSON.stringify({
				success: true,
				message: 'Detail Tagihan berhasil ditambahkan!',
				data: createdData
			}),
			{
				status: 200
			}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, code: 500, message: 'Detail Tagihan gagal ditambahkan!' }),
			{
				status: 500
			}
		);
	}
}
