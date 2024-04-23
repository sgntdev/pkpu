import { prisma } from '$lib/prisma.server.js';
import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';
export async function GET({ params, request }) {
	let token = request.headers.get('authorization');
	const id = parseInt(params.kreditorid);
	const url = new URL(request.url);
	const tagihan = url.searchParams.get('tagihan');
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
	let kreditorQuery = {
		where: {id},
		include:{}
	};

	if(tagihan){
		kreditorQuery.include = {
			Tagihan: {
				include:{
					SifatTagihan : {
						select:{
							sifat:true
						}
					}
				}
			}
		}
	}
	const kreditor = await prisma.kreditor.findUnique(kreditorQuery);

	if (!kreditor) {
		return new Response(
			JSON.stringify({ success: false, code: 404, message: 'Kreditor tidak ditemukan!' }),
			{
				status: 404
			}
		);
	}
	return new Response(JSON.stringify({ success: true, message: 'Berhasil', data: kreditor }), {
		status: 200
	});
}

export async function PUT({ params, request }) {
	let token = request.headers.get('authorization');
	const id = parseInt(params.kreditorid);
	const data = await request.json();
	const { userId, nama, email, noTelp, alamat } = data;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const validation = {
		success: false,
		errors: []
	};
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
		if (!decoded) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
		if (!nama) {
			validation.errors.push({ field: 'nama', message: 'Nama tidak boleh kosong!' });
		}
		if (!email) {
			validation.errors.push({ field: 'email', message: 'Email tidak boleh kosong!' });
		} else if (!emailRegex.test(email)) {
			validation.errors.push({ field: 'email', message: 'Format email tidak valid!' });
		}
		if (!noTelp) {
			validation.errors.push({ field: 'noTelp', message: 'No Telepon tidak boleh kosong!' });
		}
		if (!alamat) {
			validation.errors.push({ field: 'alamat', message: 'Alamat tidak boleh kosong!' });
		}
		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation), { status: 400 });
		}
		const kreditor = await prisma.kreditor.update({
			where: { id },
			data: {
				userId,
				nama,
				email,
				noTelp,
				alamat
			}
		});

		return new Response(
			JSON.stringify({ success: true, message: 'Kreditor berhasil diubah!', data: kreditor }),
			{
				status: 200
			}
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, code: 500, message: 'Kreditor gagal diubah!' }),
			{ status: 500 }
		);
	}
}

// export async function DELETE({ params }) {
// 	const id = parseInt(params.id);
// 	try {
// 		await prisma.kreditor.delete({
// 			where: { id }
// 		});
// 		return new Response(JSON.stringify({ message: 'Kreditor berhasil dihapus!' }), { status: 200 });
// 	} catch (error) {
// 		return new Response(JSON.stringify({ message: 'Kreditor gagal dihapus!' }), { status: 400 });
// 	}
// }
