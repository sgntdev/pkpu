import { error } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.server.js';

export async function load({ params, cookies, fetch }) {
	const { debitorUid, uniqueCode } = params;
	const cookieDebitorUid = cookies.get('debitorUid')
	let latestDebitor = cookieDebitorUid ?? debitorUid
	const userverif = await prisma.UserVerify.findUnique({
		where: { uniqueCode },
		select: {
			email: true
		}
	});
	if (userverif) {
		const res = await fetch(`/api/auth`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(params)
		});
		if (!res.ok) {
			if (res.status === 400) {
				error(res.status, {
					message: 'Expired Unique Code',
					description: 'Please use a valid verification link'
				});
			} else {
				error(res.status, 'Not Found');
			}
		}
		const result = await res.json();
		const user = await prisma.user.findUnique({
			where: { email: userverif.email },
			select: {
				roleId: true
			}
		});
		if (result.authToken) {
			await cookies.delete('AuthorizationToken', { path: '/' });
			cookies.set('AuthorizationToken', result.authToken, {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 // one day
			});
			cookies.set('debitorUid', latestDebitor, {
				path: '/',
				httpOnly: false,
				secure: false,
				sameSite: '',
				maxAge: 60 * 60 * 24 // one day
			});
			return { success: true, user: userverif.email, roleId: user?.roleId };
		} else {
			error(404, {
				message: 'Token Not Found',
				description: 'Please ensure that the information you entered is correct'
			});
		}
	} else {
		error(404, {
			message: 'User Not Found',
			description: 'Please ensure that the information you entered is correct'
		});
	}
}
