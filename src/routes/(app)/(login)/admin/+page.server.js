import { redirect } from '@sveltejs/kit';

export async function load({ locals, cookies }) {
	const { user } = locals;
	const latestDebitorUid = cookies.get('debitorUid') ?? '';
	if (user?.roleId === 1 || user?.roleId === 2 || user?.roleId === 3) {
		redirect(303, `/dashboard`);
	}
	if (user?.roleId === 4) {
		redirect(303, `/tagihan`);
	}
	return {
		uid: latestDebitorUid,
		status: 200
	};
}
