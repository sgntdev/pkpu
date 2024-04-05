// import { redirect } from '@sveltejs/kit';

// /** @type {import('./$types').PageServerLoad} */
// export async function load({ fetch, locals }) {
// 	const { user } = locals;
// 	if (user?.roleId === 1 || user?.roleId === 2) {
// 		redirect(303, '/dashboard');
// 	}
// 	const res = await fetch(`/api/debitor`);
// 	const result = await res.json();
// 	const debitorData = result.data.map((debitor) => {
// 		const link = debitor.nama.replace(/\s/g, '-').toLowerCase();
// 		return {
// 			...debitor,
// 			link
// 		};
// 	});
// 	return {
// 		status: 200,
// 		body: {
// 			user,
// 			debitor: debitorData
// 		}
// 	};
// }
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, params, fetch }) {
	const { user } = locals;
	const { slug } = params;
	if (user?.roleId === 1 || user?.roleId === 2) {
		redirect(303, `/dashboard`);
	} 
	if (user?.roleId === 3) {
		redirect(303, `/tagihan`);
	} 
	if (slug) {
		const res = await fetch(`/api/debitor/uid/${slug}`);
		const result = await res.json();
		if (!result.success) {
			error(404, { message: result.message, description: '' });
		}
	}
	return {
		status: 200
	};
}
