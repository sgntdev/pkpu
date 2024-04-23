import { prisma } from '$lib/prisma.server.js';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN, SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';

export async function GET({ params, request }) {
	let token = request.headers.get('authorization');
	const url = new URL(request.url);
	const userId = parseInt(url.searchParams.get('userId'));
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
	const tagihanId = parseInt(params.tagihanid);
	const tagihanQuery = {
		where: { id: tagihanId },
		include: {
			SifatTagihan: {
				select: {
					sifat: true
				}
			},
			Kreditor: true,
			DokumenTagihan: {
				select: {
					tipeDokumenId: true,
					nama_dokumen: true,
					dokumen_url: true,
					TipeDokumen: {
						select: {
							tipe: true
						}
					}
				}
			}
		}
	};
	if (userId) {
		tagihanQuery.include.TagihanVote = {
			where: { userId }
		};
	}
	const tagihanJoin = await prisma.tagihan.findUnique(tagihanQuery);
	if (!tagihanJoin) {
		return new Response(
			JSON.stringify({
				success: false,
				code: 500,
				message: 'Tagihan tidak ditemukan!'
			}),
			{ status: 500 }
		);
	}
	return new Response(JSON.stringify({ success: true, message: 'Berhasil', data: tagihanJoin }));
}

function unformatPrice(price) {
	const formatted = price.replace(/,/g, '');
	return formatted;
}

export async function PUT({ params, request }) {
	let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ success: false, code: 401, message: 'Unauthorized' }), {
			status: 401
		});
	}
	const tagihanId = parseInt(params.tagihanid);
	const formData = await request.formData();
	const tipeDokumenIds = formData.getAll('tipeDokumenId');
	const dokumenTagihanData = [];
	const dokumens = formData.getAll('dokumen');
	const oldDokumens = formData.getAll('dokumen_url');
	const oldDokumensIds = formData.getAll('oldDokumenId');
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
		if (oldDokumens.length < 1) {
			for (const key in tipeDokumenIds) {
				const dokumen = dokumens[key];
				if (oldDokumens[key] !== '') {
					if (dokumen?.size > maxFileSize) {
						validation.errors.push({
							field: `dokumen.${key}`,
							message: 'File memiliki ukuran terlalu besar'
						});
					}
					if (!allowedFileTypes.includes(dokumen?.type)) {
						validation.errors.push({
							field: `dokumen.${key}`,
							message: 'File harus berformat PDF'
						});
					}
				}
			}
		}

		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation), { status: 400 });
		}
		const updateTagihan = await prisma.tagihan.update({
			where: { id: tagihanId },
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
		let index = 0;
		for (const key in tipeDokumenIds) {
			const tipeDokumenId = tipeDokumenIds[key];
			const oldDokumenId = oldDokumensIds[key];
			if (oldDokumens[key] !== '') {
				await prisma.DokumenTagihan.update({
					where: { id: parseInt(oldDokumenId) },
					data: {
						tipeDokumenId: parseInt(tipeDokumenId)
					}
				});
			} else {
				const dokumen = dokumens[index];
				const fileName = dokumen.name.split('.')[0];
				const formattedfileName = fileName.replace(/\s/g, '_').toLowerCase();
				const uniqueFilename = `${Date.now()}_${debitorId}_${userId}_${formattedfileName}_${tagihanId}_${tipeDokumenId}.pdf`;
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
				index++;
			}
		}
		let data = dokumenTagihanData.map((item) => ({
			tipeDokumenId: item.tipeDokumenId,
			nama_dokumen: item.nama_dokumen,
			dokumen_url: item.dokumen_url,
			tagihanId: item.tagihanId
		}));

		if (data.length > 0) {
			await prisma.dokumenTagihan.createMany({
				data
			});
		}

		return new Response(
			JSON.stringify({
				success: true,
				message: 'Tagihan berhasil diubah!'
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
