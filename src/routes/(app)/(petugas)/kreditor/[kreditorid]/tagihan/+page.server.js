import { error } from '@sveltejs/kit';

export async function load({ params, fetch, locals }) {
	const { user, token } = locals;
	const { kreditorid } = params;
	const kreditorId = parseInt(kreditorid);
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1 || user.roleId === 2) {
			const res = await fetch(`/api/kreditor/${kreditorId}?tagihan=true`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const kreditorWithTagihan = await res.json()
			return {
				status: 200,
				body: {
					kreditor: kreditorWithTagihan.data,
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
