import { prisma } from '$lib/prisma.server.js';
export async function GET({params, request}) {
    let token = request.headers.get('authorization');
	const userId = parseInt(params.userid)
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
	try {
		const kreditors = await prisma.kreditor.findMany({
            where : { userId }
        });
		return new Response(JSON.stringify(kreditors), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Error Unexpected' }), { status: 401 });
	}
};