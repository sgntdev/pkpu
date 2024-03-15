import { error, redirect } from '@sveltejs/kit';
export async function load({ locals }) {
	const { user, token } = locals;
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1) {
			return {
				status: 200,
				body: {
					token
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
