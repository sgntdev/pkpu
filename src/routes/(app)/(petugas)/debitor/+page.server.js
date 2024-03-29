import { error } from '@sveltejs/kit';

export async function load({ locals, fetch }) {
	const { user, token } = locals;
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1 || user.roleId === 2) {
			const res = await fetch('/api/debitor');
			const debitor = await res.json();
			return {
				status: 200,
				body: {
					roleId : user.roleId,
					debitor: debitor.data, 
					token
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
