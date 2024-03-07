import { prisma } from '$lib/prisma.server.js';

export async function GET({request}) {
    let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
    try {
		const verify = await prisma.Verified.findMany();
		return new Response(JSON.stringify(verify), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Error Unexpected' }), { status: 401 });
	};
};

export async function POST({request}){
    let token = request.headers.get('authorization');
	const password = await request.json();
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
    try {
		const existingData = await prisma.Verified.findMany()
		if(existingData.length >= 1) {
			return new Response(JSON.stringify({ success: false, message: 'Password hanya boleh satu!' }), { status: 400 });
		}else{
			await prisma.Verified.create({
				data : {
					password 
				}
			});
			return new Response(JSON.stringify({ success: true, message: 'Password berhasil ditambahkan!' }), { status: 200 });
		}
	} catch (error) {
		return new Response(JSON.stringify({ success: false, message: 'Password gagal ditambahkan!' }), { status: 401 });
	};
}