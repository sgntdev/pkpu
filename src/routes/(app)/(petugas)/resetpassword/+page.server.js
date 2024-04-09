import { redirect, error } from '@sveltejs/kit';
export async function load({ cookies, locals }) {
	const uniqueCode = cookies.get('resetPassword');
	if (!uniqueCode) {
		error(404, 'Page Not Found');
	}
	return {
		status: 200,
		body: {
			uniqueCode,
			token: locals.token
		}
	};
}
