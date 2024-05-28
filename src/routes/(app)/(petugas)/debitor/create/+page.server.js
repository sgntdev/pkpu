import { error, redirect } from '@sveltejs/kit';
export async function load({ locals, fetch }) {
	const { user, token } = locals;
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1) {
			const pengurusRes = await fetch(`/api/user?roleId=1`, {
                method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
            })
			const pengurus = await pengurusRes.json()
			return {
				status: 200,
				body: {
					token,
					pengurus : pengurus.data
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
