import { error, redirect } from "@sveltejs/kit";

export async function load({ locals }) {
	const { user } = locals;
	if(!user){
		redirect(303, '/');
	}else{
		if (user.roleId === 1 || user.roleId === 2) {
			return {
					user : user
			}
		}else{
			error(404, 'Page Not Found');
		}
	}
}
