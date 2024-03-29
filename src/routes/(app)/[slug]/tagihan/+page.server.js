import { error, redirect } from '@sveltejs/kit';

export async function load({ params, fetch, locals }) {
	const { user, token } = locals;
	if (!user) {
		redirect(303, '/login');
	}
	const debitorRes = await fetch('/api/debitor');
	const debitors = await debitorRes.json();

	const modifiedDebitors = debitors.data.map((data) => {
		const link = data.nama.replace(/\s/g, '-').toLowerCase();
		return {
			...data,
			link
		};
	});

	const debitor = modifiedDebitors.find((data) => data.link === params.slug);
	if (!debitor) {
		error(404, 'Page Not Found');
	} else {
		//get all data tagihan
		const tagihanResponse = await fetch(`/api/debitor/${debitor.id}/tagihan?userId=${user.id}`, {
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
				tagihan : tagihan.data,
				link : params.slug
			}
		};
	}
}
