import { prisma } from '$lib/prisma.server.js';
export async function GET({ params, request }) {
	let token = request.headers.get('authorization');
	const id = parseInt(params.kreditorid);
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
	try {
		const kreditor = await prisma.kreditor.findUnique({
			where: { id }
		});
		if (!kreditor) {
			return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
		} else {
			return new Response(JSON.stringify(kreditor), { status: 200 });
		}
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Error Unexpected' }), { status: 401 });
	}
}

export async function PUT({params, request}){
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
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
	try {
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
			return new Response(JSON.stringify(validation));
		}
		await prisma.kreditor.update({
			where:{id},
			data: {
				userId,
				nama,
				email,
				noTelp,
				alamat
			}
		});

		return new Response(
			JSON.stringify({ success: true, message: 'Kreditor berhasil diubah!' })
		);
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ success: false, message: 'Kreditor gagal diubah!' }));
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
