import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const session = cookies.get('AuthorizationToken');
	// if (session !== '') {
	// 	cookies.set('AuthorizationToken', '', {
	// 		path: '/',
	// 		httpOnly: true,
	// 		secure: true,
	// 		sameSite: 'strict',
	// 		maxAge: 60 * 60 * 24
	// 	});
	// 	console.log('set empty cookie');
	// } else {
        console.log('cookie empty and logout' , session);
		await cookies.delete('AuthorizationToken', { path: '/' });
		await cookies.delete('authToken', { path: '/' });
	// }
	redirect(302, '/');
}
