import transporter from '$lib/emailSetup.server.js';
import { prisma } from '$lib/prisma.server.js';
import { fail, json } from '@sveltejs/kit';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

export async function load({ params }) {
	const { uniquecode } = params;
	const user = await prisma.users.findUnique({
		where: { uniqueCode: uniquecode }
	});
	if (user) {
		const kreditorData = await prisma.kreditor.findMany();
		const sifatTagihanData = await prisma.sifatTagihan.findMany();
		const tipeDokumenData = await prisma.tipeDokumen.findMany();
		return {
			status: 200,
			body: {
				role: user.role,
				uniquecode: uniquecode,
				kreditorData,
				sifatTagihanData,
				tipeDokumenData
			}
		};
	} else {
		return {
			status: 400,
			body: {
				error: 'Invalid uniquecode'
			}
		};
	}
}

function unformatPrice(price) {
	const formatted = price.replace(/,/g, '');
	return formatted;
}

export const actions = {
	addTagihan: async ({ params, request }) => {
		// const { uniquecode } = params;
		const formData = await request.formData();
		const payload = Object.fromEntries(formData);

		const tipeDokumenIds = formData.getAll('tipeDokumenId');
		const dokumenTagihanData = [];
		const dokumens = formData.getAll('dokumen');
		const kreditorId = formData.get('kreditorId');
		// const pertanggal = formData.get('pertanggal');
		const { dokumen } = Object.fromEntries(formData)
		const data = {
			success : false,
			errors : {}
		}
		try {
			if(!payload.kreditorId){
				data.errors.kreditorId = 'required'
				return data
			}
			if(!payload.pertanggal){
				data.errors.pertanggal = 'required'
				return data
			}
			// const createdTagihan = await prisma.tagihan.create({
			// 	data:{
			// 		kreditorId : parseInt(payload.kreditorId),
			// 		pertanggal : payload.pertanggal,
			// 		hutangPokok : unformatPrice(payload.hutangPokok),
			// 		bunga : unformatPrice(payload.bunga),
			// 		denda : unformatPrice(payload.denda),
			// 		sifatTagihanId : parseInt(payload.sifatTagihanId),
			// 		jumlahTagihan : payload.jumlahTagihan,
			// 		mulaiTertunggak : payload.mulaiTertunggak,
			// 		jumlahHari : payload.jumlahHari
			// 	}
			// });
		
			// const tagihanId = createdTagihan.id;

			// for (const key in tipeDokumenIds) {
			// 	const tipeDokumenId = tipeDokumenIds[key];
			// 	const dokumen = dokumens[key];
			// 	dokumenTagihanData.push({
			// 		tipeDokumenId: parseInt(tipeDokumenId) ?? 0,
			// 		dokumen: dokumen.name,
			// 		tagihanId
			// 	});
			// }
			// await prisma.dokumenTagihan.createMany({
			// 	data: dokumenTagihanData
			// });
			// if (!dokumens) {
			// 	console.error('Invalid file data');
			// 	return {
			// 		status: 400,
			// 		body: 'Invalid file data'
			// 	};
			// }

			// const uploadsDir = join(process.cwd(), 'static/');
			// mkdirSync(uploadsDir, { recursive: true });

			// for (const file of dokumens) {
			// 	const filePath = join(uploadsDir, file.name);
		
			// 	writeFileSync(filePath, Buffer.from(await file.arrayBuffer()));
			// 	console.log('uploadsDir:', uploadsDir);
			// 	console.log('file:', file);
			// }
			return {
				success: true,
				message: 'berhasil'
			};
		} catch (error) {
			console.log(error);
			return { success: false, message: error.message };
		}
	},
	addKreditor: async ({ request }) => {
		const formData = await request.formData();
		const nama = formData.get('nama');
		const email = formData.get('email');
		const noTelp = formData.get('noTelp');
		const alamat = formData.get('alamat');
		try {
			await prisma.kreditor.create({
				data: {
					nama,
					email,
					noTelp,
					alamat
				}
			});

			return { success: true, message: 'Kreditor berhasil ditambahkan' };
		} catch (error) {
			console.log(error);
			if (error.code === 'P2002' && error.meta.target.includes('email')) {
				return {
					success: false,
					message: 'Email kreditor sudah terdaftar, silahkan periksa kembali'
				};
			}
			return { success: false, message: 'Kreditor gagal ditambahkan' };
		}
	}
};
