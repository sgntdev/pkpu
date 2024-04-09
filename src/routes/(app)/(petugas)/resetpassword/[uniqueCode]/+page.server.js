import { prisma } from '$lib/prisma.server.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ params, cookies }) {
    const { uniqueCode } = params;
    const verified = await prisma.Verified.findUnique({
        where: { uniqueCode }
    });
    
    if (verified) {
        if (new Date(verified.expirationDate) < new Date()) {
            error(500, 'Your link is expired');
        }
        cookies.set('resetPassword', uniqueCode, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 2 // two hours
        });
        // redirect(303, '/resetpassword')
        return {
            status: 200,
        };
    } else {
        error(404, 'Page Not Found');
    }
}
