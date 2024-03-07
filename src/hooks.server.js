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
			var decoded = jwt.verify(token, SECRET_INGREDIENT);
			const currentUser = await prisma.User.findUnique({
				where: { email: decoded.user.email }
			});
			event.locals.user = {
				email: currentUser.email,
				roleId: currentUser.roleId
			};
		} catch (error) {
			error = error.name;
		}
	}

	if (event.url.pathname.includes('/tagihan') || event.url.pathname.includes('/kreditor')) {
		if (!event.locals.user) {
			throw redirect(303, '/');
		}
	}
	if (error) {
		throw redirect(303, '/');
	}
	const response = await resolve(event);

	return response;
}
