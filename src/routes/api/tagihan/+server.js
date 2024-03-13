import { prisma } from '$lib/prisma.server.js';
import { error, redirect } from '@sveltejs/kit';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';

export async function GET({ request }) {
	let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
	try {
		const tagihan = await prisma.tagihan.findMany();
		return new Response(JSON.stringify(tagihan), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Error Unexpected' }), { status: 400 });
	}
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
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
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
		bunga,
		denda,
		sifatTagihanId,
		jumlahTagihan,
		mulaiTertunggak,
		jumlahHari
	} = Object.fromEntries(formData);
	const allowedFileTypes = ['application/pdf'];
	const maxFileSize = 2 * 1024 * 1024; // 2 MB
	const validation = {
		success: false,
		errors: []
	};
	try {
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

		// if (!dokumens || dokumens.length === 0) {
		// 	validation.errors.push({ field: 'dokumen', message: 'Bukti dokumen tidak boleh kosong!' });
		// }
		for (const key in tipeDokumenIds) {
			const dokumen = dokumens[key];
			if (dokumen.size > maxFileSize) {
				validation.errors.push({ field: `dokumen.${key}`, message: 'File memiliki ukuran terlalu besar' });
			}
			if (!allowedFileTypes.includes(dokumen.type)) {
				validation.errors.push({ field: `dokumen.${key}`, message: 'File harus berformat PDF' });
			}
		}

		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation));
		}
		const createdTagihan = await prisma.tagihan.create({
			data: {
				debitorId: parseInt(debitorId),
				userId: parseInt(userId),
				kreditorId: parseInt(kreditorId),
				pertanggal,
				hutangPokok: unformatPrice(hutangPokok),
				bunga: unformatPrice(bunga),
				denda: unformatPrice(denda),
				sifatTagihanId: parseInt(sifatTagihanId),
				jumlahTagihan,
				mulaiTertunggak,
				jumlahHari
			}
		});

		const tagihanId = createdTagihan.id;

		for (const key in tipeDokumenIds) {
			const tipeDokumenId = tipeDokumenIds[key];
			const dokumen = dokumens[key];
			const fileName = dokumen.name.split('.')[0];
			const formattedfileName = fileName.replace(/\s/g, '_').toLowerCase();
			const uniqueFilename = `${Date.now()}_${debitorId}_${userId}_${formattedfileName}_${tagihanId}_${tipeDokumenId}.pdf`;
			const { url } = await put(uniqueFilename, dokumen, {
				access: 'public',
				token: BLOB_READ_WRITE_TOKEN
			});
			dokumenTagihanData.push({
				tipeDokumenId: parseInt(tipeDokumenId),
				// name: uniqueFilename,
				dokumen: url,
				tagihanId
			});
		}
		let data = dokumenTagihanData.map((item) => ({
			tipeDokumenId: item.tipeDokumenId,
			dokumen: item.dokumen,
			tagihanId: item.tagihanId
		}));

		await prisma.dokumenTagihan.createMany({
			data
		});

		// if (!dokumens) {
		// 	console.error('Invalid file data');
		// 	return {
		// 		status: 400,
		// 		body: 'Invalid file data'
		// 	};
		// }

		// const uploadsDir = join(process.cwd(), 'static/doc/');
		// mkdirSync(uploadsDir, { recursive: true });

		// for (const file of dokumenTagihanData) {
		// 	const filePath = join(uploadsDir, file.name);
		// 	writeFileSync(filePath, Buffer.from(await file.dokumen.arrayBuffer()));
		// 	console.log('uploadsDir:', uploadsDir);
		// 	console.log('file:', file);
		// }
		return new Response(
			JSON.stringify({
				success: true,
				message: 'Tagihan berhasil ditambahkan'
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Tagihan gagal ditambahkan'
			}),
			{ status: 400 }
		);
	}
}
