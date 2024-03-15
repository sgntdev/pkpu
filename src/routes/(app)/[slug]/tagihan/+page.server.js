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
		const tagihanResult = await tagihanResponse.json();
		//get all data kreditor
		const kreditorResponse = await fetch(`/api/kreditor`, {
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
		// find user id
		const userRes = await fetch(`/api/user/${user.email}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const userData = await userRes.json();
		// find tagihan from specific debitor
		const tagihanByUserId = tagihanResult.filter((data) => data.userId === userData.id)
		const tagihanByDebitorId = tagihanByUserId.filter((data) => data.debitorId === debitor.id);
		//creates formatted data for display to clients
		let formattedData = tagihanByDebitorId.map((item) => {
			const kreditor = kreditorResult.find((data) => data.id === item.kreditorId).nama;
			const sifatTagihan = sifatTagihanResult.find((data) => data.id === item.sifatTagihanId).sifat;
			return {
				id:item.id,
				kreditor,
				pertanggal: item.pertanggal,
				sifatTagihan,
				totalTagihan: parseInt(item.denda) + parseInt(item.hutangPokok) + parseInt(item.bunga),
				jumlahTagihan: item.jumlahTagihan,
				kurunTunggakan: item.mulaiTertunggak,
				statusTagihan: item.status
			};
		});
		return {
			status: 200,
			body: {
				tagihan: formattedData, 
				link : params.slug
			}
		};
	}
}
