import { redirect } from '@sveltejs/kit';
export async function load({ cookies }) {
	await cookies.delete('AuthorizationToken', { path: '/' });
	redirect(302, '/');
}
