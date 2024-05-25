<script>
	import { Spinner, Card, Button} from 'flowbite-svelte';
	import { BadgeCheckSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	export let data
	const {uniqueCode, token} = data.body
	let loading = false;
	let status = null;
	let form;
	let reset = {
		uniqueCode,
		password: '',
		confirmPassword: ''
	};

	//show hide password
	let showPassword = false;
	$: type = showPassword ? 'text' : 'password';
	$: inputProperties = { type };
	const handleSubmit = async () => {
		status = null;
		loading = true;
		try {
			const response = await fetch('/api/resetpassword', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(reset)
			});

			const result = await response.json();
			form = result;
			if (result.success) {
				status = 'success';
				setTimeout(() => {
					window.close();
				}, 2000);
			} else {
				if (result.errors.length === 0) {
					status = 'error';
				}
			}
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	};
</script>

{#if loading}
	<Spinner size={12} />
{:else if status === 'error'}
	<ExclamationCircleSolid class="mb-4 h-32 w-32 text-red-600" />
	<h1
		class="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl"
	>
		Password Gagal Diubah
	</h1>
{:else if status === 'success'}
	<BadgeCheckSolid class="mb-4 h-32 w-32 text-primary-600" />
	<h1
		class="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl"
	>
		Password Berhasil Diubah
	</h1>
{:else}
	<Card size="sm" padding="lg">
		<form class="flex flex-col space-y-6" on:submit|preventDefault={handleSubmit}>
			<h3 class="text-xl font-medium text-gray-900 dark:text-white">
				Reset verify tagihan password
			</h3>
			<div>
				<label
					for="Password"
					class={`mb-2 block text-sm font-medium ${reset.password === '' && form?.errors?.find((error) => error.field === 'password') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
					>New Password</label
				>
				<input
					{...inputProperties}
					name="Password"
					id="Password"
					placeholder="•••••••••"
					bind:value={reset.password}
					class={`block w-full rounded-lg border p-2.5 text-sm ${reset.password === '' && form?.errors?.find((error) => error.field === 'password') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
				/>
				{#if reset.password === '' && form?.errors?.find((error) => error.field === 'password')}
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
					{...inputProperties}
					name="confirmPassword"
					id="confirmPassword"
					placeholder="•••••••••"
					bind:value={reset.confirmPassword}
					class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'confirmPassword') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
				/>
				{#if form?.errors?.find((error) => error.field === 'confirmPassword')}
					<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
						{form?.errors?.find((error) => error.field === 'confirmPassword').message}
					</p>
				{/if}
			</div>
			<div class="mb-5 flex items-start">
				<div class="flex h-5 items-center">
					<input
						id="showPassword"
						bind:checked={showPassword}
						type="checkbox"
						class="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-800"
					/>
				</div>
				<label for="showPassword" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
					>Show password</label
				>
			</div>
			<Button type="submit">Reset Password</Button>
		</form>
	</Card>
{/if}
