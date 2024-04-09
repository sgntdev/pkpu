import { error, redirect } from '@sveltejs/kit';
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, fetch }) {
	const { user, token } = locals;
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1) {
			const res = await fetch('/api/verifypassword', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const result = await res.json();
			return {
				status: 200,
				body: {
					verified: result.data,
					token,
					email : user.email
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
