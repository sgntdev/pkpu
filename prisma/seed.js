import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
	const konkuren = await prisma.sifatTagihan.upsert({
		where: { id: 1 },
		update: {},
		create: {
			sifat: 'Konkuren',
            TipeDokumen : {
                create:[
                    {tipe : 'Rincian Tagihan (Invoice)' },
                    {tipe : 'Faktur' },
                    {tipe : 'Purchase Order (PO)' },
                    {tipe : 'Kartu Advokat' },
                    {tipe : 'Bukti Transfer' },
                    {tipe : 'Perjanjian Hutang/Piutang/Pernyataan Hutang' },
                ]
            }
		}
	});
	const preferent = await prisma.sifatTagihan.upsert({
		where: { id: 2 },
		update: {},
		create: {
			sifat: 'Preferent',
            TipeDokumen : {
                create:[
                    {tipe : 'Slip Gaji' },
                    {tipe : 'Perjanjian Kontrak Kerja' },
                    {tipe : 'ID Card' },
                    {tipe : 'Bukti Potong PPH / SPT' },
                    {tipe : 'Bukti BPJS' },  
                ]
            }
		}
	});
	const separatis = await prisma.sifatTagihan.upsert({
		where: { id: 3 },
		update: {},
		create: {
			sifat: 'Separatis',
            TipeDokumen : {
                create:[
                    {tipe : 'Perjanjian Kredit' },
                    {tipe : 'Sertifikat Hak Tanggungan (Fidusia / Hipotik)' },
                    {tipe : 'Dokumen Kepemilikan (Jaminan)' },
                    {tipe : 'IMB (Izin Mendirikan Bangunan)' },
                    {tipe : 'PBB (Pajak Bumi Bangunan)' },
                    {tipe : 'Somasi' },
                    {tipe : 'Akte Pendirian Perusahaan' },
                    {tipe : 'Identitas Direktur' },
                    {tipe : 'Surat Kuasa' },   
                ]
            }
		}
	});

	const kreditur1 = await prisma.kreditor.upsert({
		where: {id : 1},
		update:{},
		create : {
			nama : "PT Cahaya Sejahtera",
			alamat : "Jl. Jendral Sudirman No. 123, Jakarta",
			noTelp : "02112345678",
			email : "info@cahayasejahtera.com"
		}
	})
	const kreditur2 = await prisma.kreditor.upsert({
		where: {id : 2},
		update:{},
		create : {
			nama : "PT Harmoni Makmur",
			alamat : "Jl. Raya Cipta Karya No. 45, Surabaya",
			noTelp : "03198765432",
			email : "contact@harmonimakmur.co.id"
		}
	})
	const kreditur3 = await prisma.kreditor.upsert({
		where: {id : 3},
		update:{},
		create : {
			nama : "PT Sentosa Abadi",
			alamat : "Komplek Sentosa Indah Blok A2, Bandung",
			noTelp : "02187654321",
			email : "support@sentosaabadi.net"
		}
	})
	const admin = await prisma.role.upsert({
		where:{id:1},
		update:{},
		create:{
			name : 'admin'
		}
	})
	const pengurus = await prisma.role.upsert({
		where:{id:2},
		update:{},
		create:{
			name : 'pengurus'
		}
	})
	const kreditor = await prisma.role.upsert({
		where:{id:3},
		update:{},
		create:{
			name : 'kreditor'
		}
	})
	console.log({ konkuren, preferent, separatis, kreditur1, kreditur2, kreditur3, admin, pengurus, kreditor });
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
