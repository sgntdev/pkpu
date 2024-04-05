<!-- <script>
	import { goto } from '$app/navigation';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';
	export let data;
	const { debitor } = data.body;
	onMount(() => {
		if (data.body.user) {
			if (data.body.user.roleId === 1 || data.body.user.roleId === 2) {
				goto('/dashboard', {
					replaceState: true
				});
			}
		}
	});
</script>

<div class="space-y-4">
	<h1 class="text-3xl font-bold tracking-tight text-gray-900">List Debitor PKPU</h1>
	<div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
		{#if debitor.length === 0}
			<div
				class="border-1 flex w-full items-center justify-center rounded-md border border-gray-300 py-40"
			>
				<h1 class="text-md font-medium text-gray-400 dark:text-white">
					List debitor masih kosong.
				</h1>
			</div>
		{:else}
			<Table>
				<TableHead>
					<TableHeadCell>No</TableHeadCell>
					<TableHeadCell>Nama</TableHeadCell>
					<TableHeadCell>Tanggal Sidang</TableHeadCell>
					<TableHeadCell>Tempat Sidang</TableHeadCell>
					<TableHeadCell>Link</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each debitor as data, index (data)}
						<TableBodyRow>
							<TableBodyCell>{index + 1}</TableBodyCell>
							<TableBodyCell>{data.nama}</TableBodyCell>
							<TableBodyCell>{data.tglSidang}</TableBodyCell>
							<TableBodyCell>{data.tempatSidang}</TableBodyCell>
							<TableBodyCell>
								<a
									href={`/${data.link}/tagihan`}
									class="font-medium text-primary-600 hover:underline dark:text-primary-500"
									>{data.nama}</a
								>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</div>
</div> -->
<script>
	import { page } from '$app/stores';
	let { slug } = $page.params;
	import { Spinner, Card, Button, Label, Input, Helper, Toast } from 'flowbite-svelte';
	import {
		BadgeCheckSolid,
		ExclamationCircleSolid,
	} from 'flowbite-svelte-icons';
	let loading = false;
	let status = null;
	let form;
	let data = {
		debitorUid :'',
		email:''
	}
	const handleSubmit = async () => {
		status = null;
		loading = true;
		if(slug){
			data.debitorUid = slug
		}
		try {
			const response = await fetch('/api/user', {
				method: 'POST',
				body: JSON.stringify(data)
			});

			const result = await response.json();
			form = result;
			if (result.success) {
				status = 'success';
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
		class="mb-5 whitespace-normal px-4 text-center text-sm font-normal text-gray-500 dark:text-gray-400 md:text-lg"
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
			{#if !slug}
				<Label
					class="space-y-2"
					color={form?.errors?.find((error) => error.field === 'debitorUid') ? 'red' : undefined}
				>
					<span>Kode Debitor</span>
					<Input
						type="text"
						name="debitorUid"
						bind:value={data.debitorUid}
						placeholder="Kode debitor"
						color={form?.errors?.find((error) => error.field === 'debitorUid') ? 'red' : undefined}
					/>
					{#if form?.errors?.find((error) => error.field === 'debitorUid')}
						<Helper class="mt-2" color="red"
							>{form?.errors?.find((error) => error.field === 'debitorUid').message}</Helper
						>
					{/if}
				</Label>
			{/if}
			<Label
				class="space-y-2"
				color={form?.errors?.find((error) => error.field === 'email') ? 'red' : undefined}
			>
				<span>Email</span>
				<Input
					type="text"
					name="email"
					bind:value={data.email}
					placeholder="name@company.com"
					color={form?.errors?.find((error) => error.field === 'email') ? 'red' : undefined}
				/>
				{#if form?.errors?.find((error) => error.field === 'email')}
					<Helper class="mt-2" color="red"
						>{form?.errors?.find((error) => error.field === 'email').message}</Helper
					>
				{/if}
			</Label>
			<Button type="submit">Submit</Button>
		</form>
	</Card>
{/if}
