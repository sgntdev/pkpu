import { prisma } from '$lib/prisma.server.js';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN, SECRET_INGREDIENT } from '$env/static/private';
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
	if (!decoded) {
		return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
			status: 403
		});
	}
	const tagihanQuery = {
		orderBy: {
			id: 'asc'
		},
		include: {
			Kreditor: {
				select: {
					nama: true
				}
			},
			SifatTagihan: {
				select: {
					sifat: true
				}
			}
		}
	};

	if (decoded.user.roleId === 1 || decoded.user.roleId === 2 || decoded.user.roleId === 3) {
		tagihanQuery.include.TagihanItem = {
			include: {
				SifatTagihan: true
			}
		};
	}
	const tagihan = await prisma.tagihan.findMany(tagihanQuery);
	if (!tagihan) {
		return new Response(
			JSON.stringify({ success: false, code: 404, message: 'Tagihan tidak ditemukan!' }),
			{
				status: 404
			}
		);
	}
	return new Response(JSON.stringify({ success: true, message: 'Berhasil', data: tagihan }));
}

function unformatPrice(price) {
	const formatted = price.replace(/,/g, '');
	return formatted;
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
	const tipeDokumenIds = formData.getAll('tipeDokumenId');
	const dokumenTagihanData = [];
	const dokumens = formData.getAll('dokumen');
	const {
		debitorId,
		userId,
		kreditorId,
		pertanggal,
		hutangPokok,
		keterangan,
		bunga,
		denda,
		sifatTagihanId,
		jumlahTagihan,
		mulaiTertunggak,
		jumlahHari,
		totalVoters
	} = Object.fromEntries(formData);
	const allowedFileTypes = ['application/pdf'];
	const maxFileSize = 25 * 1024 * 1024; // 25 MB
	const validation = {
		success: false,
		errors: []
	};
	try {
		let decoded = jwt.verify(token, SECRET_INGREDIENT);
		const currentUser = await prisma.User.findUnique({
			where: { email: decoded.user.email }
		});
		if (!currentUser) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
		if (!kreditorId) {
			validation.errors.push({
				field: 'kreditorId',
				message: 'Identitas kreditor tidak boleh kosong!'
			});
		}
		if (!pertanggal) {
			validation.errors.push({ field: 'pertanggal', message: 'Pertanggal tidak boleh kosong!' });
		}
		if (!hutangPokok) {
			validation.errors.push({ field: 'hutangPokok', message: 'Hutang pokok tidak boleh kosong!' });
		} else if (isNaN(parseFloat(hutangPokok))) {
			validation.errors.push({ field: 'hutangPokok', message: 'Hutang pokok harus berupa angka!' });
		}
		if (keterangan.length > 25) {
			validation.errors.push({ field: 'keterangan', message: 'Keterangan maksimal 25 karakter!' });
		}
		if (!denda) {
			validation.errors.push({ field: 'denda', message: 'Denda tidak boleh kosong!' });
		} else if (isNaN(parseFloat(denda))) {
			validation.errors.push({ field: 'denda', message: 'Denda harus berupa angka!' });
		}
		if (!bunga) {
			validation.errors.push({ field: 'bunga', message: 'Bunga tidak boleh kosong!' });
		} else if (isNaN(parseFloat(bunga))) {
			validation.errors.push({ field: 'bunga', message: 'Bunga harus berupa angka!' });
		}
		if (!sifatTagihanId) {
			validation.errors.push({
				field: 'sifatTagihanId',
				message: 'Sifat/golongan tagihan tidak boleh kosong!'
			});
		}
		if (!jumlahTagihan) {
			validation.errors.push({
				field: 'jumlahTagihan',
				message: 'Jumlah tagihan tidak boleh kosong!'
			});
		}
		if (!mulaiTertunggak) {
			validation.errors.push({
				field: 'mulaiTertunggak',
				message: 'Mulai tertunggak tidak boleh kosong!'
			});
		}
		if (!jumlahHari) {
			validation.errors.push({ field: 'jumlahHari', message: 'Jumlah hari tidak boleh kosong!' });
		}
		for (const key in tipeDokumenIds) {
			const dokumen = dokumens[key];
			if (dokumen.size > maxFileSize) {
				validation.errors.push({
					field: `dokumen.${key}`,
					message: 'File memiliki ukuran terlalu besar'
				});
			}
			if (!allowedFileTypes.includes(dokumen.type)) {
				validation.errors.push({ field: `dokumen.${key}`, message: 'File harus berformat PDF' });
			}
		}

		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation), { status: 400 });
		}
		const createdTagihan = await prisma.tagihan.create({
			data: {
				debitorId: parseInt(debitorId),
				userId: parseInt(userId),
				kreditorId: parseInt(kreditorId),
				pertanggal,
				hutangPokok: unformatPrice(hutangPokok),
				keterangan,
				bunga: unformatPrice(bunga),
				denda: unformatPrice(denda),
				sifatTagihanId: parseInt(sifatTagihanId),
				jumlahTagihan,
				mulaiTertunggak,
				jumlahHari,
				totalVoters: parseInt(totalVoters)
			}
		});

		const tagihanId = createdTagihan.id;

		for (const key in tipeDokumenIds) {
			const tipeDokumenId = tipeDokumenIds[key];
			const dokumen = dokumens[key];
			const fileName = dokumen.name.split('.')[0];
			const formattedfileName = fileName.replace(/\s/g, '_').toLowerCase();
			const uniqueFilename = `${Date.now()}_${formattedfileName}.pdf`;
			const { url } = await put(uniqueFilename, dokumen, {
				access: 'public',
				token: BLOB_READ_WRITE_TOKEN,
				addRandomSuffix: false
			});
			dokumenTagihanData.push({
				tipeDokumenId: parseInt(tipeDokumenId),
				nama_dokumen: dokumen.name,
				dokumen_url: url,
				tagihanId
			});
		}
		let data = dokumenTagihanData.map((item) => ({
			tipeDokumenId: item.tipeDokumenId,
			nama_dokumen: item.nama_dokumen,
			dokumen_url: item.dokumen_url,
			tagihanId: item.tagihanId
		}));

		await prisma.dokumenTagihan.createMany({
			data
		});

		return new Response(
			JSON.stringify({
				success: true,
				message: 'Tagihan berhasil ditambahkan!'
			}),
			{ status: 200 }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				success: false,
				code: 500,
				message: 'Tagihan gagal ditambahkan!'
			}),
			{ status: 500 }
		);
	}
}
