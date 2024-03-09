import { error, redirect } from '@sveltejs/kit';
/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, fetch }) {
	const { user, token } = locals;
	const res = await fetch('/api/verifypassword', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	const data = await res.json();
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1) {
			return {
				status: 200,
				body: {
					verified: data,
					token
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
