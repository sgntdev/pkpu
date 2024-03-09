/** @type {import('./$types').PageServerLoad} */
export async function load({locals, fetch, params}) {
    const {user} = locals
    return {
        status : 200,
        body : {
            user,
            slug : params.slug
        }
    };
};