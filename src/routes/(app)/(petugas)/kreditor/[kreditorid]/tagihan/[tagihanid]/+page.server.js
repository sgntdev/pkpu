import { error, redirect } from '@sveltejs/kit';

export async function load({ params, fetch, locals }) {
	const { user, token } = locals;
	const { tagihanid } = params;
	const tagihanId = parseInt(tagihanid);
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1 || user.roleId === 2) {
			const tagihanResponse = await fetch(`/api/tagihan/${tagihanId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const tagihan = await tagihanResponse.json();
			return {
				status: 200,
				body: {
					roleId: user.roleId,
					tagihan,
					token
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
