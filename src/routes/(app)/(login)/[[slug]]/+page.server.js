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
		}else{
			return {
				uid: result.data.uid,
				status: 200
			};
		}
	}
	return {
		status: 200
	};
}
