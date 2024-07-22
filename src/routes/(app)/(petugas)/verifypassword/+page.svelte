<script>
	import { showToast } from '$lib/toastStore';
	import { Button, Breadcrumb, BreadcrumbItem, Spinner } from 'flowbite-svelte';
	export let data;
	const { token, verified, userId } = data.body;
	let form;
	let verify = {
		userId,
		password: '',
		confirmPassword: ''
	};
	let newVerify = {
		oldPassword: '',
		newPassword: '',
		confirmPassword: ''
	};

	let loading = false;
	$: existingData = verified ? true : false;
	const handleAddPassword = async () => {
		loading = true;
		try {
			const response = await fetch('/api/verifypassword', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(verify)
			});
			const result = await response.json();
			if (result.success) {
				showToast(result.message, 'success');
				verify = {};
				form = '';
				existingData = true;
			} else {
				form = result;
				if (!result.errors) {
					showToast(result.message, 'error');
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	};

	const handleEditPassword = async () => {
		loading = true;
		try {
			const response = await fetch(`/api/verifypassword/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(newVerify)
			});
			const result = await response.json();
			if (result.success) {
				showToast(result.message, 'success');
				newVerify = {};
				form = '';
			} else {
				form = result;
				if (!result.errors) {
					showToast(result.message, 'error');
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	};

	const handleResetPass = async () => {
		loading = true;
		try {
			const response = await fetch('/api/resetpassword', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(userId)
			});
			const result = await response.json();
			if (result.success) {
				showToast(result.message, 'success');
			} else {
				showToast(result.message, 'error');
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	};
</script>

<div class="space-y-4">
	<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
		<BreadcrumbItem href="/dashboard" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem>Verify Password</BreadcrumbItem>
	</Breadcrumb>
	<div class="mx-auto flex flex-col items-center justify-center px-6 py-8 lg:py-14">
		{#if loading}
			<div class="flex min-h-96 items-center justify-center">
				<Spinner color="blue" size={10} />
			</div>
		{:else if existingData || verified?.length > 0}
			<div
				class="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0"
			>
				<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
					<h1
						class="text-xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
					>
						Change Verify Password
					</h1>
					<form
						class="space-y-4 md:space-y-6"
						method="PUT"
						on:submit|preventDefault={handleEditPassword}
					>
						<div>
							<label
								for="Password"
								class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'oldPassword') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
								>Old Password</label
							>
							<input
								type="password"
								name="oldPassword"
								id="oldPassword"
								placeholder="•••••••••"
								bind:value={newVerify.oldPassword}
								class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'oldPassword') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
							/>
							{#if form?.errors?.find((error) => error.field === 'oldPassword')}
								<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
									{form?.errors?.find((error) => error.field === 'oldPassword').message}
								</p>
							{/if}
						</div>
						<div>
							<label
								for="Password"
								class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'newPassword') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
								>New Password</label
							>
							<input
								type="password"
								name="newPassword"
								id="newPassword"
								placeholder="•••••••••"
								bind:value={newVerify.newPassword}
								class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'newPassword') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
							/>
							{#if form?.errors?.find((error) => error.field === 'newPassword')}
								<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
									{form?.errors?.find((error) => error.field === 'newPassword').message}
								</p>
							{/if}
						</div>
						<div>
							<label
								for="confirmPassword"
								class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'confirmPassword') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
								>Confirm Password</label
							>
							<input
								type="password"
								name="confirmPassword"
								id="confirmPassword"
								placeholder="•••••••••"
								bind:value={newVerify.confirmPassword}
								class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'confirmPassword') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
							/>
							{#if form?.errors?.find((error) => error.field === 'confirmPassword')}
								<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
									{form?.errors?.find((error) => error.field === 'confirmPassword').message}
								</p>
							{/if}
						</div>
						<Button type="submit" class="w-full">Ubah password</Button>
						<div class="flex items-center justify-center gap-1">
							<p class="text-sm text-gray-500">Forgot your old password?</p>
							<button
								type="button"
								on:click={handleResetPass}
								class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
								>Reset password</button
							>
						</div>
					</form>
				</div>
			</div>
		{:else}
			<div
				class="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0"
			>
				<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
					<h1
						class="text-xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
					>
						Verify Password
					</h1>
					<form
						class="space-y-4 md:space-y-6"
						method="POST"
						on:submit|preventDefault={handleAddPassword}
					>
						<div>
							<label
								for="Password"
								class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'password') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
								>Password</label
							>
							<input
								type="password"
								name="Password"
								id="Password"
								placeholder="•••••••••"
								bind:value={verify.password}
								class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'password') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
							/>
							{#if form?.errors?.find((error) => error.field === 'password')}
								<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
									{form?.errors?.find((error) => error.field === 'password').message}
								</p>
							{/if}
						</div>
						<div>
							<label
								for="confirmPassword"
								class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'confirmPassword') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
								>Confirm Password</label
							>
							<input
								type="password"
								name="confirmPassword"
								id="confirmPassword"
								placeholder="•••••••••"
								bind:value={verify.confirmPassword}
								class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'confirmPassword') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
							/>
							{#if form?.errors?.find((error) => error.field === 'confirmPassword')}
								<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
									{form?.errors?.find((error) => error.field === 'confirmPassword').message}
								</p>
							{/if}
						</div>
						<Button type="submit" class="w-full">Simpan password</Button>
					</form>
				</div>
			</div>
		{/if}
	</div>
</div>
