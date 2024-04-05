import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({cookies}) {
    await cookies.delete('AuthorizationToken', { path: '/' });
    redirect(302, '/')
};