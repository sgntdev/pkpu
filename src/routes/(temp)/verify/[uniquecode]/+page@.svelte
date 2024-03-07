<script>
	/** @type {import('./$types').PageData} */
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	export let data;
	const {success, user, roleId} = data
	onMount(() => {
		if (success) {
			if(roleId === 1){
				goto('/dashboard', {
					state: {
						user : user
					}
				});
			}else{
				goto('/', {
					state: {
						user : user
					}
				});
			}
		}
	});
</script>
