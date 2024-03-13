<script>
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		Breadcrumb,
		BreadcrumbItem,
		Modal,
		Spinner,
		Toast
	} from 'flowbite-svelte';
	import {
		ExclamationCircleOutline,
		CheckCircleSolid,
		XCircleSolid
	} from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';
	export let data;
	const { token } = data.body;
	let verified = data.body.verified;
	let password;
	let formModal = false;
	let deleteModal = false;
	let editModal = false;

	let loading = false;
	let deleteTargetId;
	let editTargetId;
	let showToast = false;
	let toastData;
	const handleAddPassword = async () => {
		loading = true;
		try {
			const response = await fetch('/api/verifypassword', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(password)
			});
			const result = await response.json();
			if (result.success) {
				formModal = false;
				showToast = true;
				toastData = {
					success: true,
					message: result.message
				};
				setTimeout(() => {
					showToast = false;
					clearToastData();
				}, 2000);
				const updatedDataResponse = await fetch('/api/verifypassword', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const updatedData = await updatedDataResponse.json();
				verified = updatedData;
				password = '';
			} else {
				showToast = true;
				toastData = {
					success: false,
					message: result.message
				};
				setTimeout(() => {
					showToast = false;
					clearToastData();
				}, 2000);
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
			const response = await fetch(`/api/verifypassword/${editTargetId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify(password)
			});
			const result = await response.json();
			if (result.success) {
				editModal = false;
				showToast = true;
				toastData = {
					success: true,
					message: result.message
				};
				setTimeout(() => {
					showToast = false;
					clearToastData();
				}, 2000);
				const updatedDataResponse = await fetch('/api/verifypassword', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const updatedData = await updatedDataResponse.json();
				verified = updatedData;
				password = '';
			} else {
				showToast = true;
				toastData = {
					success: false,
					message: result.message
				};
				setTimeout(() => {
					showToast = false;
					clearToastData();
				}, 2000);
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	};
	const handleDeletePassword = async () => {
		try {
			const response = await fetch(`/api/verifypassword/${deleteTargetId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				}
			});
			const result = await response.json();
			if (result.success) {
				showToast = true;
				toastData = {
					success: true,
					message: result.message
				};
				setTimeout(() => {
					showToast = false;
					clearToastData();
				}, 2000);
				const updatedDataResponse = await fetch('/api/verifypassword', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				const updatedData = await updatedDataResponse.json();
				verified = updatedData;
			} else {
				showToast = true;
				toastData = {
					success: false,
					message: result.message
				};
				setTimeout(() => {
					showToast = false;
					clearToastData();
				}, 2000);
			}
		} catch (error) {
			console.error(error);
		} finally {
			deleteTargetId = null;
			deleteModal = false;
		}
	};
	const openDeleteModal = (id) => {
		deleteTargetId = id;
		deleteModal = true;
	};
	const openEditModal = (id, newPassword) => {
		editTargetId = id;
		editModal = true;
		password = newPassword;
	};
	const clearToastData = () => {
		toastData = null;
	};
</script>

{#if showToast}
	<div transition:fly={{ x: 200 }} class="top-15 absolute end-5">
		<Toast color={toastData?.success ? 'green' : 'red'} class="z-50 mb-4">
			<svelte:fragment slot="icon">
				{#if toastData?.success}
					<CheckCircleSolid class="h-5 w-5" />
					<span class="sr-only">Check icon</span>
				{:else}
					<XCircleSolid class="h-5 w-5" />
					<span class="sr-only">Error icon</span>
				{/if}
			</svelte:fragment>
			{toastData?.message}
		</Toast>
	</div>
{/if}

<div class="space-y-4">
	<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
		<BreadcrumbItem href="/dashboard" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem>Verify Password</BreadcrumbItem>
	</Breadcrumb>
	<div class="min-h-max overflow-hidden rounded-lg border border-gray-200 p-8 dark:border-gray-700">
		<div class="mb-4 flex flex-col items-start justify-between sm:mb-0 md:flex-row">
			<caption
				class="mb-2 bg-white text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white md:mb-5"
			>
				Verify Password
				<p class="mt-1 text-sm font-light text-gray-500 dark:text-gray-400">
					Kelola password untuk melakukan verify tagihan.
				</p>
			</caption>
			{#if !verified.length > 0}
				<Button
					on:click={() => (formModal = true)}
					class="flex h-fit w-full items-center justify-center rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-fit"
				>
					Tambah password
				</Button>
			{/if}
		</div>
		{#if verified.length === 0}
			<div
				class="border-1 flex w-full items-center justify-center rounded-md border border-gray-300 py-40"
			>
				<h1 class="text-md font-medium text-gray-400 dark:text-white">
					Password Verify masih kosong.
				</h1>
			</div>
		{:else}
			<Table divClass="mt-2 overflow-auto">
				<TableHead>
					<TableHeadCell>No</TableHeadCell>
					<TableHeadCell>Password</TableHeadCell>
					<TableHeadCell>Aksi</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each verified as data, index (data)}
						<TableBodyRow>
							<TableBodyCell>{index + 1}</TableBodyCell>
							<TableBodyCell>{data.password}</TableBodyCell>
							<TableBodyCell>
								<div class="flex gap-2">
									<Button on:click={() => openEditModal(data.id, data.password)}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											class="h-5 w-5 shrink-0"
											role="img"
											aria-label="edit solid"
											viewBox="0 0 24 24"
											><path
												fill="currentColor"
												fill-rule="evenodd"
												d="M11.3 6.2H5a2 2 0 0 0-2 2V19a2 2 0 0 0 2 2h11c1.1 0 2-1 2-2.1V11l-4 4.2c-.3.3-.7.6-1.2.7l-2.7.6c-1.7.3-3.3-1.3-3-3.1l.6-2.9c.1-.5.4-1 .7-1.3l3-3.1Z"
												clip-rule="evenodd"
											></path><path
												fill="currentColor"
												fill-rule="evenodd"
												d="M19.8 4.3a2.1 2.1 0 0 0-1-1.1 2 2 0 0 0-2.2.4l-.6.6 2.9 3 .5-.6a2.1 2.1 0 0 0 .6-1.5c0-.2 0-.5-.2-.8Zm-2.4 4.4-2.8-3-4.8 5-.1.3-.7 3c0 .3.3.7.6.6l2.7-.6.3-.1 4.7-5Z"
												clip-rule="evenodd"
											></path></svg
										>
									</Button>
									<Button color="red" on:click={() => openDeleteModal(data.id)}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											class="h-5 w-5 shrink-0"
											role="img"
											aria-label="trash bin solid"
											viewBox="0 0 24 24"
											><path
												fill="currentColor"
												fill-rule="evenodd"
												d="M8.6 2.6A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4c0-.5.2-1 .6-1.4ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
												clip-rule="evenodd"
											></path></svg
										></Button
									>
								</div>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</div>
</div>
<!-- form modal -->
<Modal
	bind:open={formModal}
	size="xs"
	autoclose={false}
	class="w-full"
	backdropClass="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
>
	<form method="POST" class="flex flex-col space-y-4" on:submit|preventDefault={handleAddPassword}>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Tambah password</h3>
		<div>
			<label for="password" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
				>Password</label
			>
			<input
				type="text"
				bind:value={password}
				id="password"
				name="password"
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:shadow-sm-light dark:focus:border-blue-500 dark:focus:ring-blue-500"
			/>
		</div>
		<Button type="submit">
			{#if loading}
				<Spinner class="me-2" size="4" color="white" />
			{:else}
				Tambah password
			{/if}
		</Button>
	</form>
</Modal>
<!-- edit modal -->
<Modal
	bind:open={editModal}
	size="xs"
	autoclose={false}
	class="w-full"
	backdropClass="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 dark:bg-opacity-80"
>
	<form method="POST" class="flex flex-col space-y-4" on:submit|preventDefault={handleEditPassword}>
		<h3 class="text-xl font-medium text-gray-900 dark:text-white">Edit password</h3>
		<div>
			<label for="password" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
				>Password</label
			>
			<input
				type="text"
				bind:value={password}
				id="password"
				name="password"
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:shadow-sm-light dark:focus:border-blue-500 dark:focus:ring-blue-500"
			/>
		</div>
		<Button type="submit">
			{#if loading}
				<Spinner class="me-2" size="4" color="white" />
			{:else}
				Ubah password
			{/if}
		</Button>
	</form>
</Modal>
<!-- delete modal -->
<Modal bind:open={deleteModal} size="xs" autoclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Anda yakin akan menghapus password tagihan?
		</h3>
		<Button color="red" class="me-2" on:click={handleDeletePassword}>Ya, Saya yakin</Button>
		<Button color="alternative">Tidak, batal</Button>
	</div>
</Modal>
