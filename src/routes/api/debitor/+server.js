import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';
import { prisma } from '$lib/prisma.server.js';
export async function GET() {
	const debitors = await prisma.Debitor.findMany();
	return new Response(JSON.stringify({ success: true, message: 'Berhasil', data: debitors }), {
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
	const formData = await request.formData();
	const { nama, tglSidang, tempatSidang } = Object.fromEntries(formData);
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
		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation), { status: 400 });
		}
		const debitor = await prisma.debitor.create({
			data: {
				nama,
				tglSidang,
				tempatSidang
			}
		});

		return new Response(
			JSON.stringify({ success: true, message: 'Debitor berhasil ditambahkan!', data: debitor }),
			{
				status: 200
			}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, code: 500, message: 'Debitor gagal ditambahkan!' }),
			{ status: 500 }
		);
	}
}
