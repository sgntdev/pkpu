import { error } from '@sveltejs/kit';

export async function load({ fetch, locals }) {
	const { user, token } = locals;
	const kreditorId = parseInt(1);
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1 || user.roleId === 2) {
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
			return {
				status: 200,
				body: {
					tagihan: tagihan.data,
					sifatTagihanData: sifatTagihanResult.data
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
