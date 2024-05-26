import { error, redirect } from '@sveltejs/kit';
export async function load({ locals, fetch, params }) {
	const { user, token } = locals;
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1) {
            const res = await fetch(`/api/debitor/${params.id}`, {
                method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
            })
            const debitor = await res.json()
			const petugasRes = await fetch(`/api/user?roleId=1`, {
                method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
            })
			const petugas = await petugasRes.json()
			return {
				status: 200,
				body: {
					token, 
                    debitor : debitor.data,
					petugas : petugas.data
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
