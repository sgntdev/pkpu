import { prisma } from '$lib/prisma.server.js';
export async function GET({params, request}) {
    let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
    try {
        const user = await prisma.User.findUnique({
            where : {email : params.email}
        })
		return new Response(JSON.stringify(user), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Invalid JWT token' }), { status: 401 });
	}
};