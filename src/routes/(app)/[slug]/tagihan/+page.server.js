import { error, redirect } from '@sveltejs/kit';

export async function load({ params, fetch, locals }) {
	const { user, token } = locals;
	if (!user) {
		redirect(303, '/login');
	}
	const debitorRes = await fetch('/api/debitor');
	const debitors = await debitorRes.json();

	const modifiedDebitors = debitors.map((data) => {
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
		const tagihanResponse = await fetch(`/api/tagihan`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const tagihan = await tagihanResponse.json();
		const userRes = await fetch(`/api/user/${user.email}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const userData = await userRes.json();
		const tagihanByUser = tagihan.filter((data) => data.userId === userData.id)
		const tagihanByDebitor = tagihanByUser.filter((data) => data.debitorId === debitor.id)
		return {
			status: 200,
			body: {
				tagihan : tagihanByDebitor, 
				link : params.slug
			}
		};
	}
}
