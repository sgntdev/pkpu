import { error, redirect } from '@sveltejs/kit';
export async function load({ locals, fetch, params }) {
	const { token, user } = locals;
	if (!user) {
		redirect(301, '/');
	} else {
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
			// getting all data kreditor
			const kreditorResponse = await fetch(`/api/kreditor?userId=${user.id}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const kreditorResult = await kreditorResponse.json();
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
					debitorId : debitor.id,
					kreditorData: kreditorResult.data,
					userId: user.id,
					sifatTagihanData: sifatTagihanResult.data,
					tipeDokumenData: tipeDokumenResult.data
				}
			};
		}
	}
}
