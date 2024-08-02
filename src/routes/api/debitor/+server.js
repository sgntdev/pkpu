import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';
import { prisma } from '$lib/prisma.server.js';
export async function GET() {
	const debitors = await prisma.Debitor.findMany({
		orderBy: { id: 'asc' }
	});
	return new Response(JSON.stringify({ success: true, message: 'Berhasil', data: debitors }), {
		status: 200
	});
}

async function generateUniqueRandomId(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';

	// Generate a unique ID
	while (true) {
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			result += characters.charAt(randomIndex);
		}

		//   Check if the generated ID already exists in the database
		const existingUser = await prisma.debitor.findUnique({
			where: { uid: result }
		});

		if (!existingUser) {
			// If the ID is unique, break out of the loop
			break;
		} else {
			// If the ID already exists, reset and try generating a new one
			result = '';
		}
	}

	return result;
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
	const {
		nama,
		noPerkara,
		batasAkhir,
		tglVerifikasi,
		kurs,
		tglSidang,
		tempatSidang,
		pengurusAccess
	} = data;
	const validation = {
		success: false,
		errors: []
	};
	let debitorUid = null;
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
		if (!noPerkara) {
			validation.errors.push({ field: 'noPerkara', message: 'Nomor perkara tidak boleh kosong!' });
		}
		if (!batasAkhir) {
			validation.errors.push({
				field: 'batasAkhir',
				message: 'Batas akhir pengajuan tidak boleh kosong!'
			});
		}
		if (!tglVerifikasi) {
			validation.errors.push({
				field: 'tglVerifikasi',
				message: 'Nomor perkara tidak boleh kosong!'
			});
		}
		if (!kurs) {
			validation.errors.push({ field: 'kurs', message: 'Kurs tidak boleh kosong!' });
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
		if (pengurusAccess.length === 0) {
			validation.errors.push({
				field: 'pengurusAccess',
				message: 'Pengurus tidak boleh kosong!'
			});
		}
		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation), { status: 400 });
		}
		debitorUid = await generateUniqueRandomId(5);
		const debitor = await prisma.debitor.create({
			data: {
				nama,
				uid: debitorUid,
				noPerkara,
				batasAkhir,
				tglVerifikasi,
				kurs,
				tglSidang,
				tempatSidang,
				pengurusAccess
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
