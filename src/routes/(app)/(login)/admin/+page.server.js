import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, fetch }) {
	const { user } = locals;
	if (user?.roleId === 1 || user?.roleId === 2 || user?.roleId === 3) {
		redirect(303, `/dashboard`);
	} 
	if (user?.roleId === 4) {
		redirect(303, `/tagihan`);
	} 
	return {
		status: 200
	};
}
