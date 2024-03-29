import { error } from '@sveltejs/kit';

export async function load({ locals, fetch }) {
	const {user, token} = locals
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1) {
			const res = await fetch('/api/user', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const users = await res.json();
			const roleResponse = await fetch('/api/role', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			})
			const role = await roleResponse.json();
			return {
				status: 200,
				body: {
					user,
					users:users.data, 
					roleData : role.data, 
					token
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
