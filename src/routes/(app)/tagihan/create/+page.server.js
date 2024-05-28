import { error, redirect } from '@sveltejs/kit';
export async function load({ locals, fetch }) {
	const { token, user } = locals;
	if (!user || user.roleId !== 3 ) {
		redirect(301, '/');
	} else {
		const res = await fetch(`/api/debitor/uid/${user.debitorUid}`);
		const debitor = await res.json();
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
					debitorId: debitor.data.id,
					kreditorData: kreditorResult.data,
					userId: user.id,
					sifatTagihanData: sifatTagihanResult.data,
					tipeDokumenData: tipeDokumenResult.data,
					totalVoters : debitor.data.pengurusAccess.length
				}
			};
		}
	}
}
