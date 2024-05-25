import { redirect } from '@sveltejs/kit';

export async function load({ params, fetch, locals }) {
	const { user, token } = locals;
	const { tagihanid } = params;
	const tagihanId = parseInt(tagihanid);
	if (!user || user.roleId !== 3 ) {
		redirect(303, '/');
	} else {
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
				tagihan: tagihan.data
			}
		};
	}
}
