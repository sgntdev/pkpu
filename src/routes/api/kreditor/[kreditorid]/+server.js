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
