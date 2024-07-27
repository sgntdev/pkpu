import { error } from '@sveltejs/kit';
import { prisma } from '$lib/prisma.server.js';

export async function load({ params, cookies, fetch }) {
	const { uniqueCode } = params;
	let userverif;
	let result;

	try {
		userverif = await prisma.UserVerify.findUnique({
			where: { uniqueCode },
			select: {
				email: true
			}
		});
		
		if (!userverif) {
			throw error(404, {
				message: 'User Not Found',
				description: 'Please ensure that the information you entered is correct'
			});
		}

		const res = await fetch(`/api/auth`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(params)
		});
		
		if (!res.ok) {
			if (res.status === 400) {
				throw error(res.status, {
					message: 'Expired Unique Code',
					description: 'Please use a valid verification link'
				});
			} else {
				throw error(res.status, 'Not Found');
			}
		}

		result = await res.json();

		const user = await prisma.user.findUnique({
			where: { email: userverif.email },
			select: {
				roleId: true
			}
		});

		if (!result.authToken) {
			throw error(404, {
				message: 'Token Not Found',
				description: 'Please ensure that the information you entered is correct'
			});
		}

		await cookies.delete('AuthorizationToken', { path: '/' });
		cookies.set('AuthorizationToken', result.authToken, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 // one day
		});

		console.log('set cookie');
		return { success: true, user: userverif.email, roleId: user?.roleId };
	} catch (err) {
		console.error('Error in load function:', err);
		throw err;
	}
}
