import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const session = cookies.get('AuthorizationToken');
	if (session !== '') {
		cookies.set('AuthorizationToken', '', {
			path: '/'
		});
		console.log('clear cookie');
	} else {
		await cookies.delete('AuthorizationToken', { path: '/' });
	}
	redirect(302, '/');
}
