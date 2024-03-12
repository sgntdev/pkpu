import { redirect } from '@sveltejs/kit';

export async function load({locals}) {
    const {user} = locals
    if (user) {
        redirect(303, `/`)
    }
    return {
        status : 200
    };
};