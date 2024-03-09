import { error } from '@sveltejs/kit';

export async function load({ locals, fetch }) {
	const { user } = locals;
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1 || user.roleId === 2) {
			const res = await fetch('/api/debitor');
			const data = await res.json();
			return {
				status: 200,
				body: {
					roleId : user.roleId,
					debitor: data
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
