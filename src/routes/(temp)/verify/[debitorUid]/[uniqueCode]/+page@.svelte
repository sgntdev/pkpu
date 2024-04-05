<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	export let data;
	const {success, user, roleId} = data
	onMount(() => {
		if (success) {
			if(roleId === 1 || roleId === 2){
				goto('/dashboard', {
					state: {
						user
					}
				});
			}else{
				goto(`/tagihan`, {
					state: {
						user
					}
				});
			}
		}
	});
</script>
