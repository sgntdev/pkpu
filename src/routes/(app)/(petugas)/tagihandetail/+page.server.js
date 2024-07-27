import { error } from '@sveltejs/kit';

export async function load({ fetch, locals }) {
	const { user, token } = locals;
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1 || user.roleId === 2 || user.roleId === 3) {
			const res = await fetch(`/api/tagihan`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const tagihan = await res.json();

			const sifatTagihanResponse = await fetch('/api/sifattagihan', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const sifatTagihanResult = await sifatTagihanResponse.json();

			const debitorRes = await fetch('/api/debitor')
			const debitorResult = await debitorRes.json()
			return {
				status: 200,
				body: {
					tagihan: tagihan.data,
					debitorData : debitorResult.data,
					sifatTagihanData: sifatTagihanResult.data,
					token,
					roleId : user.roleId
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
