import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({cookies}) {
    await cookies.delete('AuthorizationToken', { path: '/' });
    console.log('clear cookie');
    redirect(302, '/')
};