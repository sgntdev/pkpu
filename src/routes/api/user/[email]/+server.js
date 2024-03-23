import { prisma } from '$lib/prisma.server.js';
import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';
export async function GET({params, request}) {
    let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
    try {
		let decoded = jwt.verify(token, SECRET_INGREDIENT);
		const currentUser = await prisma.User.findUnique({
			where: { email: decoded.user.email }
		});
		if (!currentUser) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
        const user = await prisma.User.findUnique({
            where : {email : params.email}
        })
		return new Response(JSON.stringify(user), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Invalid JWT token' }), { status: 401 });
	}
};

export async function PUT({params, request}){
	let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
	const role = await request.json();
	const validation = {
		success: false,
		errors: []
	};
	try {
        let decoded = jwt.verify(token, SECRET_INGREDIENT);
		const currentUser = await prisma.User.findUnique({
			where: { email: decoded.user.email }
		});
		if (currentUser.roleId !== 1) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
		if (!role) {
			validation.errors.push({ field: 'roleId', message: 'Role tidak boleh kosong!' });
		}
		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation));
		}
		const user = await prisma.User.findUnique({
			where:{email:params.email}
		})
		await prisma.User.update({
			where:{
				id : user.id
			},
			data: {
				roleId : role,
			}
		});

		const users = await prisma.user.findMany({
			orderBy: { id: 'asc' },
			include: {
				Role: true
			}
		});

		return new Response(
			JSON.stringify({ success: true, message: 'User berhasil diubah!', data:users })
		);
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ success: false, code: 403, message: 'User gagal diubah!' }));
	}
}

export async function DELETE({params, request}){
	let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
	}
	try {
        let decoded = jwt.verify(token, SECRET_INGREDIENT);
		const currentUser = await prisma.User.findUnique({
			where: { email: decoded.user.email }
		});
		if (currentUser.roleId !== 1) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
		const user = await prisma.User.findUnique({
			where:{email:params.email}
		})
		await prisma.User.delete({
			where:{
				id : user.id
			}
		});
		await prisma.UserVerify.delete({
			where:{email:params.email}
		})
		const users = await prisma.user.findMany({
			orderBy: { id: 'asc' },
			include: {
				Role: true
			}
		});
		return new Response(
			JSON.stringify({ success: true, message: 'User berhasil dihapus!', data:users })
		);
	}catch (error) {
		console.log(error);
		return new Response(JSON.stringify({ success: false, code: 403, message: 'User gagal dihapus!' }));
	}
}