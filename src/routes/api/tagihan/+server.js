import { prisma } from '$lib/prisma.server.js';
import { error, redirect } from '@sveltejs/kit';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
	const tagihan = await prisma.tagihan.findMany();
	return new Response(JSON.stringify(tagihan), { status: 200 });
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
			validation.errors.push({ field: 'kreditorId', message: 'required' });
		}
		if (!pertanggal) {
			validation.errors.push({ field: 'pertanggal', message: 'required' });
		}
		if (!hutangPokok) {
			validation.errors.push({ field: 'hutangPokok', message: 'required' });
		}
		if (!denda) {
			validation.errors.push({ field: 'denda', message: 'required' });
		}
		if (!bunga) {
			validation.errors.push({ field: 'bunga', message: 'required' });
		}
		if (!sifatTagihanId) {
			validation.errors.push({ field: 'sifatTagihanId', message: 'required' });
		}
		if (!jumlahTagihan) {
			validation.errors.push({ field: 'jumlahTagihan', message: 'required' });
		}
		if (!mulaiTertunggak) {
			validation.errors.push({ field: 'mulaiTertunggak', message: 'required' });
		}
		if (!jumlahHari) {
			validation.errors.push({ field: 'jumlahHari', message: 'required' });
		}

		if (!dokumens || dokumens.length === 0) {
			validation.errors.push({ field: 'dokumen', message: 'required' });
		}

		for (const key in tipeDokumenIds) {
			const dokumen = dokumens[key];

			if (dokumen.size > maxFileSize) {
				validation.errors.push({ field: `dokumen.${key}`, message: 'File terlalu besar' });
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
			console.log(tipeDokumenId);
			const dokumen = dokumens[key];
			const fileName = dokumen.name.split('.')[0];
			const formattedfileName = fileName.replace(/\s/g, '_').toLowerCase();
			const uniqueFilename = `${Date.now()}_${debitorId}_${userId}_${formattedfileName}_${tagihanId}_${tipeDokumenId}.pdf`;

			dokumenTagihanData.push({
				tipeDokumenId: parseInt(tipeDokumenId),
				name: uniqueFilename,
				dokumen,
				tagihanId
			});
		}
		let data = dokumenTagihanData.map((item) => ({
			tipeDokumenId: item.tipeDokumenId,
			dokumen: item.name,
			tagihanId: item.tagihanId
		}));
		await prisma.dokumenTagihan.createMany({
			data
		});

		if (!dokumens) {
			console.error('Invalid file data');
			return {
				status: 400,
				body: 'Invalid file data'
			};
		}

		const uploadsDir = join(process.cwd(), 'static/doc/');
		mkdirSync(uploadsDir, { recursive: true });

		for (const file of dokumenTagihanData) {
			const filePath = join(uploadsDir, file.name);
			writeFileSync(filePath, Buffer.from(await file.dokumen.arrayBuffer()));
			console.log('uploadsDir:', uploadsDir);
			console.log('file:', file);
		}
		return new Response(
			JSON.stringify({
				success: true,
				message: 'Tagihan berhasil ditambahkan'
			})
		);
	} catch (error) {
		console.log(error);
		return new Response(
			JSON.stringify({
				success: false,
				message: 'Tagihan gagal ditambahkan'
			})
		);
	}
}
