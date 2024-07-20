import { prisma } from '$lib/prisma.server.js';
import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';

export async function GET({ request, params }) {
	let token = request.headers.get('authorization');
	const id = parseInt(params.id);
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ success: false, code: 401, message: 'Unauthorized' }), {
			status: 401
		});
	}
	let decoded = jwt.verify(token, SECRET_INGREDIENT);
	// if (decoded.user.roleId !== 1) {
	// 	return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
	// 		status: 403
	// 	});
	// }
	if (!decoded) {
		return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
			status: 403
		});
	}
	const debitor = await prisma.debitor.findUnique({ where: { id } });
	if (!debitor) {
		return new Response(
			JSON.stringify({ success: false, code: 404, message: 'Debitor tidak ditemukan!' }),
			{
				status: 404
			}
		);
	}
	return new Response(
		JSON.stringify({ success: true, message: 'Berhasil', data: debitor }, { status: 200 })
	);
}

export async function PUT({ request, params }) {
	let token = request.headers.get('authorization');
	const id = parseInt(params.id);
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ success: false, code: 401, message: 'Unauthorized' }), {
			status: 401
		});
	}
	const data = await request.json();
	const { nama, tglSidang, tempatSidang, pengurus } = data;
	let pengurusAccess = pengurus.map((item) => item.value);
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
		if (!nama) {
			validation.errors.push({ field: 'nama', message: 'Nama tidak boleh kosong!' });
		}
		if (!tglSidang) {
			validation.errors.push({ field: 'tglSidang', message: 'Tanggal sidang tidak boleh kosong!' });
		}
		if (!tempatSidang) {
			validation.errors.push({
				field: 'tempatSidang',
				message: 'Tempat sidang tidak boleh kosong!'
			});
		}
		if (pengurus.length === 0) {
			validation.errors.push({
				field: 'pengurus',
				message: 'Pengurus tidak boleh kosong!'
			});
		}
		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation), { status: 400 });
		}
		await prisma.debitor.update({
			where: { id },
			data: {
				nama,
				tglSidang,
				tempatSidang,
				pengurusAccess
			}
		});
		const debitors = await prisma.Debitor.findMany({
			orderBy: { id: 'asc' }
		});
		return new Response(
			JSON.stringify({ success: true, message: 'Debitor berhasil diubah!', data: debitors }),
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return new Response(
			JSON.stringify({ success: false, code: 500, message: 'Debitor gagal diubah!' }),
			{ status: 500 }
		);
	}
}

export async function DELETE({ request, params }) {
	let token = request.headers.get('authorization');
	const id = parseInt(params.id);
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
		if (decoded.user.roleId !== 1) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
		const debitor = await prisma.debitor.findUnique({ where: { id } });
		if (!debitor) {
			return new Response(
				JSON.stringify({ success: false, code: 404, message: 'Debitor tidak ditemukan!' }),
				{
					status: 404
				}
			);
		}
		await prisma.debitor.delete({
			where: { id }
		});
		const debitors = await prisma.Debitor.findMany({
			orderBy: { id: 'asc' }
		});
		return new Response(JSON.stringify({ success: true, message: 'Debitor berhasil dihapus!', data: debitors }), {
			status: 200
		});
	} catch (error) {
		console.log(error);
		return new Response(
			JSON.stringify({ success: false, code: 500, message: 'Debitor gagal dihapus!' }),
			{ status: 500 }
		);
	}
}
