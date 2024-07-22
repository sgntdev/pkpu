import { prisma } from '$lib/prisma.server.js';
import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';

export async function GET({ params, request }) {
	let token = request.headers.get('authorization');
	const itemId = parseInt(params.itemid);
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ success: false, code: 401, message: 'Unauthorized' }), {
			status: 401
		});
	}
	let decoded = jwt.verify(token, SECRET_INGREDIENT);
	if (decoded.user.roleId !== 1 && decoded.user.roleId !== 2) {
		return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
			status: 403
		});
	}
	const tagihanItem = await prisma.tagihanItem.findUnique({ where: { id: itemId } });
	if (!tagihanItem) {
		return new Response(
			JSON.stringify({
				success: false,
				code: 404,
				message: 'Detail Tagihan Item tidak ditemukan!'
			}),
			{
				status: 404
			}
		);
	}
	return new Response(
		JSON.stringify({ success: true, message: 'Berhasil', data: tagihanItem }, { status: 200 })
	);
}

export async function PUT({ params, request }) {
	let token = request.headers.get('authorization');
	const itemId = parseInt(params.itemid);
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
		if (decoded.user.roleId !== 1 && decoded.user.roleId !== 2) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
		if (!data.tipe) {
			validation.errors.push({ field: `tipe`, message: 'Tipe tidak boleh kosong!' });
		}
		if (!data.sifatTagihanId) {
			validation.errors.push({
				field: `sifatTagihanId`,
				message: 'Sifat Tagihan tidak boleh kosong!'
			});
		}
		if (!data.amount) {
			validation.errors.push({ field: `amount`, message: 'Amount tidak boleh kosong!' });
		} else if (isNaN(parseFloat(data.amount))) {
			validation.errors.push({ field: `amount`, message: 'Amount harus berupa angka!' });
		}
		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation), { status: 400 });
		}
		const tagihanItem = await prisma.tagihanItem.findUnique({ where: { id: itemId } });
		if (!tagihanItem) {
			return new Response(
				JSON.stringify({ success: false, code: 404, message: 'Detail Tagihan tidak ditemukan!' }),
				{
					status: 404
				}
			);
		}
		const updateData = await prisma.tagihanItem.update({
			where: {
				id: itemId
			},
			data
		});
		return new Response(
			JSON.stringify({
				success: true,
				message: 'Detail Tagihan berhasil diubah!',
				data: updateData
			}),
			{
				status: 200
			}
		);
	} catch (error) {
		console.log(error);
		return new Response(
			JSON.stringify({ success: false, code: 500, message: 'Detail Tagihan gagal diubah!' }),
			{
				status: 500
			}
		);
	}
}

export async function DELETE({ params, request }) {
	let token = request.headers.get('authorization');
	const itemId = parseInt(params.itemid);
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
		const tagihanItem = await prisma.tagihanItem.findUnique({ where: { id: itemId } });
		if (!tagihanItem) {
			return new Response(
				JSON.stringify({ success: false, code: 404, message: 'Detail Tagihan tidak ditemukan!' }),
				{
					status: 404
				}
			);
		}
		await prisma.tagihanItem.delete({
			where: { id: itemId }
		});
		return new Response(
			JSON.stringify({ success: true, message: 'Detail Tagihan berhasil dihapus!' }),
			{
				status: 200
			}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, code: 500, message: 'Detail Tagihan gagal dihapus!' }),
			{ status: 500 }
		);
	}
}
