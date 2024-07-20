import { error } from '@sveltejs/kit';

export async function load({ locals, fetch }) {
	const { user, token } = locals;
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1 || user.roleId === 2) {
			const pengurusRes = await fetch(`/api/user?roleId=1&roleId=2`, {
                method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
            })
			const pengurus = await pengurusRes.json()
			const res = await fetch('/api/debitor');
			const debitor = await res.json();
			return {
				status: 200,
				body: {
					roleId : user.roleId,
					debitor: debitor.data, 
					token,
					pengurus : pengurus.data
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
