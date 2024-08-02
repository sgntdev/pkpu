import { SECRET_INGREDIENT } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export async function handle({ event, resolve }) {
	const token = event.cookies.get('AuthorizationToken');
	event.locals.token = token ?? '';
	let error;
	if (!event.url.pathname.startsWith('/api')) {
		if (token) {
			try {
				let decoded = jwt.verify(token, SECRET_INGREDIENT);
				if (new Date(decoded.user.expirationDate) < new Date()) {
					redirect(303, '/');
				} else {
					event.locals.user = {
						id: decoded.user.id,
						email: decoded.user.email,
						roleId: decoded.user.roleId,
						debitorUid : decoded.user.debitorUid
					};
				}
			} catch (error) {
				error = error.name;
			}
		}
	}
	
	if (error) {
		redirect(303, '/');
	}
	const response = await resolve(event);

	return response;
}
