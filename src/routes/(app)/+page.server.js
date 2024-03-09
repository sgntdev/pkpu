import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch, locals }) {
	const { user } = locals;
	if (user?.roleId === 1 || user?.roleId === 2) {
		redirect(303, '/dashboard');
	}
	const res = await fetch(`/api/debitor`);
	const data = await res.json();
	const debitorData = data.map((debitor) => {
		const link = debitor.nama.replace(/\s/g, '-').toLowerCase();
		return {
			...debitor,
			link
		};
	});
	return {
		status: 200,
		body: {
			user,
			debitor: debitorData
		}
	};
}
