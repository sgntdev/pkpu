import { prisma } from '$lib/prisma.server.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, fetch }) {
	const { user, token } = locals;
	if (!user) {
		redirect(303, '/');
	} else {
		const users = await prisma.user.findMany();
		const res = await fetch('/api/kreditor', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});
		const data = await res.json();
		if (user.roleId === 1 || user.roleId === 2) {
			const kreditorData = data.map((kreditor) => {
				const link = kreditor.nama.replace(/\s/g, '-').toLowerCase();
				const userEmail = users.find((user) => user.id === kreditor.userId).email;
				return {
					...kreditor,
					link,
					userEmail
				};
			});
			return {
				status: 200,
				body: {
					kreditorData
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
