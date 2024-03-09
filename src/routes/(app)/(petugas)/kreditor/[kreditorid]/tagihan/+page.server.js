import { error } from '@sveltejs/kit';

export async function load({ params, fetch, locals }) {
	const { user, token } = locals;
	const { kreditorid } = params;
	const kreditorId = parseInt(kreditorid);
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1 || user.roleId === 2) {
			// get all data kreditor
			const kreditorResponse = await fetch(`/api/kreditor`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const kreditorResult = await kreditorResponse.json();
			// find kreditor from specific kreditor
			const kreditorByKreditorId = kreditorResult.find((data) => data.id === kreditorId);
			// get all data tagihan
			const tagihanResponse = await fetch('/api/tagihan', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const tagihanResult = await tagihanResponse.json();
			// find tagihan from specific kreditor
			const tagihanByKreditorId = tagihanResult.filter((data) => data.kreditorId === kreditorId);
			// getting all data sifat tagihan
			const sifatTagihanResponse = await fetch('/api/sifattagihan', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const sifatTagihanResult = await sifatTagihanResponse.json();
			//creates formatted data for display to clients
			let formattedData = [];
			tagihanByKreditorId.map((data) => {
				const sifatTagihanData = sifatTagihanResult.find(
					(sifat) => sifat.id === data.sifatTagihanId
				);
				let totalTagihan = parseInt(data.hutangPokok) + parseInt(data.denda) + parseInt(data.bunga);
				formattedData.push({
					id: data.id,
					pertanggal: data.pertanggal,
					totalTagihan,
					sifatTagihan: sifatTagihanData.sifat,
					jumlahTagihan: data.jumlahTagihan,
					kurunTunggakan: data.mulaiTertunggak,
					statusTagihan : data.status
				});
			});
			return {
				status: 200,
				body: {
					tagihan: formattedData,
					kreditor: kreditorByKreditorId
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
