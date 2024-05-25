import { error, redirect } from '@sveltejs/kit';

export async function load({ fetch, locals }) {
	const { user, token } = locals;
	if (!user || user.roleId !== 3 ) {
		redirect(303, '/');
	}
	const res = await fetch(`/api/debitor/uid/${user.debitorUid}`);
	const debitor = await res.json();
	if (!debitor) {
		error(404, 'Page Not Found');
	} else {
		//get all data tagihan
		const tagihanResponse = await fetch(
			`/api/debitor/${debitor.data.id}/tagihan?userId=${user.id}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			}
		);
		const tagihan = await tagihanResponse.json();
		return {
			status: 200,
			body: {
                debitor: debitor.data,
				tagihan: tagihan.data
			}
		};
	}
}
