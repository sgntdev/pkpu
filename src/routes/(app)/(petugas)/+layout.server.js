import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, fetch, cookies }) {
	const { user } = locals;
	const cookieDebitorUid = cookies.get('debitorUid')
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1 || user.roleId === 2 || user.roleId === 3) {
			const debitorResponse = await fetch('/api/debitor');
			const debitorResult = await debitorResponse.json();
			return {
				body: {
					cookieDebitorUid,
					user: user,
					debitorData: debitorResult.data,
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
