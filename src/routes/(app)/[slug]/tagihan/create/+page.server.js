import { error, redirect } from '@sveltejs/kit';
export const prerender = false;
export async function load({ locals, fetch, params }) {
	const { token, user } = locals;
	if (!user) {
		redirect(301, '/');
	} else {
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
			// find user from specific email
			const userRes = await fetch(`/api/user/${user.email}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const userData = await userRes.json();
			// getting all data sifat kreditor
			const kreditorResponse = await fetch(`/api/kreditor`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const kreditorResult = await kreditorResponse.json();
			// find kreditor from specific user id
			const kreditorByUserId = kreditorResult.filter((data) => data.userId === userData.id);
			// getting all data sifat tagihan
			const sifatTagihanResponse = await fetch('/api/sifattagihan', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const sifatTagihanResult = await sifatTagihanResponse.json();
			// getting all data tipe dokumen
			const tipeDokumenResponse = await fetch('/api/tipedokumen', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const tipeDokumenResult = await tipeDokumenResponse.json();
			return {
				status: 200,
				body: {
					token,
					debitor,
					kreditorData: kreditorByUserId,
					userId: userData.id,
					sifatTagihanData: sifatTagihanResult,
					tipeDokumenData: tipeDokumenResult
				}
			};
		}
	}
}
