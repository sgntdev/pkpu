import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, fetch }) {
	const { user } = locals;
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1 || user.roleId === 2) {
			const debitorResponse = await fetch('/api/debitor');
			const debitorResult = await debitorResponse.json();
			return {
				body: {
					user: user,
					debitorData: debitorResult.data
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
