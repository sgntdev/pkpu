<script>
	import { Spinner, Card, Button, Label, Input } from 'flowbite-svelte';
	import { BadgeCheckSolid, ExclamationCircleSolid } from 'flowbite-svelte-icons';

	let loading = false;
	let status = null;

	const handleSubmit = async (event) => {
		let { target } = event;
		loading = true;
		status = null;

		try {
			const response = await fetch('?/sendEmail', {
				method: 'POST',
				body: new FormData(target)
			});

			const result = await response.json();

			if (response.ok) {
				status = 'success';
			} else {
				throw new Error(result.error || 'Something went wrong');
			}
		} catch (err) {
			console.error(err);
			status = 'error';
		} finally {
			loading = false;
		}
	};
</script>

<main class="flex flex-col items-center justify-center md:h-screen">
	{#if loading}
		<Spinner size={12} />
	{:else if status === 'error'}
		<ExclamationCircleSolid class="mb-4 h-32 w-32 text-red-600" />
		<h1
			class="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl"
		>
			Email Gagal Terkirim
		</h1>
	{:else if status === 'success'}
		<BadgeCheckSolid class="mb-4 h-32 w-32 text-primary-600" />
		<h1
			class="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl"
		>
			Email Berhasil Terkirim
		</h1>
		<p
			class="mb-5 whitespace-normal text-left text-base font-normal text-gray-500 dark:text-gray-400 md:text-lg"
		>
			Email telah berhasil terkirim. Mohon segera periksa kotak masuk email Anda untuk memastikan
			bahwa pesan tersebut telah diterima.
		</p>
	{:else}
		<p class="mb-4 flex items-center justify-center text-2xl font-semibold dark:text-white lg:mb-6">
			Welcome to PKPU
		</p>
		<Card size="sm" padding="lg">
			<form class="flex flex-col space-y-6" on:submit|preventDefault={handleSubmit}>
				<h3 class="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
				<Label class="space-y-2">
					<span>Email</span>
					<Input type="email" name="email" placeholder="name@company.com" required />
				</Label>
				<Button type="submit">Submit</Button>
			</form>
		</Card>
	{/if}
</main>
