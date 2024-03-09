import { prisma } from '$lib/prisma.server.js';
import { error } from '@sveltejs/kit';

export async function load({ locals, fetch }) {
	const {user, token} = locals
	const res = await fetch('/api/user', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	const data = await res.json();
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1) {
			const roleData = await prisma.role.findMany();
			let users = [];
			data.map((data) => {
				let roles = roleData.find((role) => role.id === data.roleId);
				users.push({
					email: data.email,
					role: roles.name
				});
			});
			return {
				status: 200,
				body: {
					users
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
