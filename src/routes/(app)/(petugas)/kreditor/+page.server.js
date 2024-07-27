import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, fetch }) {
	const { user, token } = locals;
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1 || user.roleId === 2 || user.roleId === 3) {
			const kreditorWithTagihanRes = await fetch(`/api/kreditor?tagihan=true`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const kreditorWithTagihan = await kreditorWithTagihanRes.json();

			const processedData = kreditorWithTagihan.data
				.filter((kreditor) => kreditor.Tagihan && kreditor.Tagihan.length > 0) 
				.map((kreditor) => {
					const debitorIds = kreditor.Tagihan
						? kreditor.Tagihan.map((tagihan) => tagihan.debitorId)
						: [];
					// Menghapus duplikat debitorId
					const uniqueDebitorIds = [...new Set(debitorIds)];
					// Menggabungkan debitorId menjadi satu string
					const mergedDebitorId = uniqueDebitorIds.join(', ');
					const debitorId = mergedDebitorId != '' ? parseInt(mergedDebitorId) : null;
					return {
						id: kreditor.id,
						userEmail: kreditor.User.email,
						nama: kreditor.nama,
						email: kreditor.email,
						alamat: kreditor.alamat,
						noTelp: kreditor.noTelp,
						debitorId
					};
				});
			return {
				status: 200,
				body: {
					kreditorData: processedData,
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
