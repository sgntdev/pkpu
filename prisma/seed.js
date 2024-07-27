// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function main() {
// 	const konkuren = await prisma.sifatTagihan.upsert({
// 		where: { id: 1 },
// 		update: {},
// 		create: {
// 			sifat: 'Konkuren',
// 			TipeDokumen: {
// 				create: [
// 					{ tipe: 'Rincian Tagihan (Invoice)' },
// 					{ tipe: 'Faktur' },
// 					{ tipe: 'Purchase Order (PO)' },
// 					{ tipe: 'Kartu Advokat' },
// 					{ tipe: 'Bukti Transfer' },
// 					{ tipe: 'Perjanjian Hutang/Piutang/Pernyataan Hutang' }
// 				]
// 			}
// 		}
// 	});
// 	const preferent = await prisma.sifatTagihan.upsert({
// 		where: { id: 2 },
// 		update: {},
// 		create: {
// 			sifat: 'Preferent',
// 			TipeDokumen: {
// 				create: [
// 					{ tipe: 'Slip Gaji' },
// 					{ tipe: 'Perjanjian Kontrak Kerja' },
// 					{ tipe: 'ID Card' },
// 					{ tipe: 'Bukti Potong PPH / SPT' },
// 					{ tipe: 'Bukti BPJS' }
// 				]
// 			}
// 		}
// 	});
// 	const separatis = await prisma.sifatTagihan.upsert({
// 		where: { id: 3 },
// 		update: {},
// 		create: {
// 			sifat: 'Separatis',
// 			TipeDokumen: {
// 				create: [
// 					{ tipe: 'Perjanjian Kredit' },
// 					{ tipe: 'Sertifikat Hak Tanggungan (Fidusia / Hipotik)' },
// 					{ tipe: 'Dokumen Kepemilikan (Jaminan)' },
// 					{ tipe: 'IMB (Izin Mendirikan Bangunan)' },
// 					{ tipe: 'PBB (Pajak Bumi Bangunan)' },
// 					{ tipe: 'Somasi' },
// 					{ tipe: 'Akte Pendirian Perusahaan' },
// 					{ tipe: 'Identitas Direktur' },
// 					{ tipe: 'Surat Kuasa' }
// 				]
// 			}
// 		}
// 	});

// 	const admin = await prisma.role.upsert({
// 		where: { id: 1 },
// 		update: {},
// 		create: {
// 			name: 'admin'
// 		}
// 	});
// 	const pengurus = await prisma.role.upsert({
// 		where: { id: 2 },
// 		update: {},
// 		create: {
// 			name: 'pengurus'
// 		}
// 	});
// 	const asisten = await prisma.role.upsert({
// 		where: { id: 3 },
// 		update: {},
// 		create: {
// 			name: 'asisten'
// 		}
// 	});
// 	const kreditor = await prisma.role.upsert({
// 		where: { id: 4 },
// 		update: {},
// 		create: {
// 			name: 'kreditor'
// 		}
// 	});
// 	const debitor1 = await prisma.debitor.upsert({
// 		where:{id: 1},
// 		update : {},
// 		create : {
// 			nama : 'PT Prikast Metal Indonesia (Dalam PKPU)',
// 			tglSidang : '02 July 2024',
// 			tempatSidang : 'Bandung, Indonesia',
// 			uid: '28V3Y'
// 		}
// 	})
// 	console.log({ konkuren, preferent, separatis, admin, asisten, pengurus, kreditor });
// }
// main()
// 	.then(async () => {
// 		await prisma.$disconnect();
// 	})
// 	.catch(async (e) => {
// 		console.error(e);
// 		await prisma.$disconnect();
// 		process.exit(1);
// 	});
