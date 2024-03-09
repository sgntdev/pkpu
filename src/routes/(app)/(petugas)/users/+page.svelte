<script>
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Modal,
		Label,
		Button,
		Input,
		Spinner,
		Select,
		Helper,
		Breadcrumb,
		BreadcrumbItem
	} from 'flowbite-svelte';
	import { PlusSolid } from 'flowbite-svelte-icons';
	export let data;
	const { users } = data.body;
	let formModal = false;
	let loading = false;

	const handleAddUser = () => {
		loading = true;
	};
	let form
</script>

<div class="space-y-4">
	<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
		<BreadcrumbItem href="/dashboard" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem>List Users</BreadcrumbItem>
	</Breadcrumb>
	<div class="min-h-max overflow-hidden rounded-lg border border-gray-200 p-8 dark:border-gray-700">
		<div class="mb-4 flex flex-col items-start justify-between sm:mb-0 md:flex-row">
			<caption
				class="mb-2 bg-white text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white md:mb-5"
			>
				List Users
				<p class="mt-1 text-sm font-light text-gray-500 dark:text-gray-400">Kelola semua user.</p>
			</caption>
			<Button
				on:click={() => (formModal = true)}
				class="flex h-fit w-full items-center justify-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
			>
				Tambah user
			</Button>
		</div>
		{#if users.length === 0}
			<div
				class="border-1 flex w-full items-center justify-center rounded-md border border-gray-300 py-40"
			>
				<h1 class="text-md font-medium text-gray-400 dark:text-white">List user masih kosong.</h1>
			</div>
		{:else}
			<Table divClass="mt-2 overflow-auto">
				<TableHead>
					<TableHeadCell>No</TableHeadCell>
					<TableHeadCell>Email</TableHeadCell>
					<TableHeadCell>Role</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each users as data, index (data)}
						<TableBodyRow>
							<TableBodyCell>{index + 1}</TableBodyCell>
							<TableBodyCell>{data.email}</TableBodyCell>
							<TableBodyCell class="whitespace-nowrap px-6 py-4 font-medium capitalize"
								>{data.role}</TableBodyCell
							>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</div>
</div>

<Modal
	bind:open={formModal}
	size="xs"
	autoclose={false}
	class="w-full"
	backdropClass="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
>
	<form method="POST" class="flex flex-col space-y-4" on:submit|preventDefault={handleAddUser}>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Tambah user baru</h3>
		<Label class="space-y-2">
			<span>Email</span>
			<Input type="email" name="email" placeholder="example@company.com" />
		</Label>
		<Label
			for="sifatTagihan"
			class="mb-2"
			color={form?.data?.errors?.find((error) => error.field === 'sifatTagihanId')
				? 'red'
				: undefined}>Role</Label
		>
		<Select
			id="roleId"
			class={`${form?.data?.errors?.find((error) => error.field === 'roleId') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500'} mt-2 rounded-lg border focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500`}
			name="roleId"
			placeholder="Pilih Role"
		>
				<option value=1>Pengurus</option>
				<option value=2>Petugas</option>
				<option value=3>Kreditor</option>
		</Select>
		{#if form?.data?.errors?.find((error) => error.field === 'roleId')}
			<Helper class="mt-2" color="red">Role tidak boleh kosong!</Helper>
		{/if}
		<Button type="submit">
			{#if loading}
				<Spinner class="me-2" size="4" color="white" />
			{:else}
				<PlusSolid class="me-2 h-4 w-4" />Tambah user
			{/if}
		</Button>
	</form>
</Modal>
