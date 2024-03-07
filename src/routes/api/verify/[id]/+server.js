export async function GET() {
	return new Response();
}

export async function DELETE({ params, request }) {
	const id = parseInt(params.id);
	let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
	try {
		await prisma.Verified.delete({
			where: {
				id
			}
		});
        return new Response(JSON.stringify({ success: true, message: 'Password berhasil dihapus!' }), { status: 200 });
	} catch (error) {
        return new Response(JSON.stringify({ success: false, message: 'Password gagal dihapus!' }), { status: 401});
	}
}
