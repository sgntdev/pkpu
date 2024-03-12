import { SECRET_INGREDIENT } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { prisma } from '$lib/prisma.server.js';
export async function handle({ event, resolve }) {
	const token = event.cookies.get('AuthorizationToken');
	event.locals.token = token ?? '';
	let error;
	if (token) {
		try {
			let decoded = jwt.verify(token, SECRET_INGREDIENT);
			const currentUser = await prisma.User.findUnique({
				where: { email: decoded.user.email }
			});
			if(new Date(decoded.user.expirationDate) < new Date()){
				redirect(303, '/')
			}else{
				event.locals.user = {
					email: currentUser.email,
					roleId: currentUser.roleId
				};
			}
		} catch (error) {
			error = error.name;
		}
	}
	if (event.url.pathname.startsWith('/tagihan') || event.url.pathname.startsWith('/kreditor') || event.url.pathname.startsWith('/users') || event.url.pathname.startsWith('/verifypassword')) {
		if (!event.locals.user) {
			redirect(303, '/');
		}
	}
	if (error) {
		redirect(303, '/');
	}
	const response = await resolve(event);

	return response;
}
