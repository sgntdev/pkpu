import { error, redirect } from '@sveltejs/kit';

export async function load({ params, fetch, locals }) {
	const { user, token } = locals;
	const { tagihanid } = params;
	const tagihanId = parseInt(tagihanid);
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1 || user.roleId === 2) {
			const res = await fetch(`/api/tagihan/${tagihanId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const data = await res.json();
			// getting all data tipe dokumen
			const dokumenTagihanResponse = await fetch('/api/dokumentagihan', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const dokumenTagihanResult = await dokumenTagihanResponse.json();
			const buktiTagihan = dokumenTagihanResult.filter(
				(dokumen) => dokumen.tagihanId === tagihanId
			);
			// getting all data tipe dokumen
			const tipeDokumenResponse = await fetch('/api/tipedokumen', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const tipeDokumenResult = await tipeDokumenResponse.json();

			let dokumen = [];
			buktiTagihan.map((item) => {
				const tipe = tipeDokumenResult.find((data) => data.id === item.tipeDokumenId).tipe;
				dokumen.push({
					tipeDokumen: tipe,
					namaDokumen: item.dokumen
				});
			});
			return {
				status: 200,
				body: {
					roleId: user.roleId,
					tagihanId,
					tagihan: data,
					dokumen,
					token
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
