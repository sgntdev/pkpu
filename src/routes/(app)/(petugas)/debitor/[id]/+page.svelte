<script>
	import { goto } from '$app/navigation';
	import { Breadcrumb, BreadcrumbItem, Button } from 'flowbite-svelte';
	let form;
	export let data;
	const { token, debitor } = data.body;
	let loading = false;

	const handleEditDebitor = async (event) => {
		loading = true;
		const formData = new FormData(event.currentTarget);
		try {
			const response = await fetch(`/api/debitor/${debitor.id}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`
				},
				body: formData
			});
			const result = await response.json();
			if (result.success) {
				goto('./', {
					replaceState: true,
					state: {
						statusSuccess: true,
						message: result.message
					}
				});
			} else {
				form = result;
			}
		} catch (err) {
			console.error('client', err);
		} finally {
			loading = false;
		}
	};
</script>

<div class="space-y-4">
	<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
		<BreadcrumbItem href="/dashboard" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem href="/debitor">List Debitor</BreadcrumbItem>
		<BreadcrumbItem>Tambah Debitor</BreadcrumbItem>
	</Breadcrumb>

	<div class="min-h-max overflow-hidden rounded-lg border border-gray-200 p-8 dark:border-gray-700">
		<div class="space-y-4 sm:space-y-6">
			<h1
				class="text-xl font-semibold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
			>
				Edit Debitor
			</h1>
			<form
				class="space-y-4 md:space-y-6"
				method="POST"
				on:submit|preventDefault={handleEditDebitor}
			>
				<div>
					<label
						for="Nama"
						class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'nama') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Nama</label
					>
					<input
						type="text"
						name="nama"
						id="Nama"
						bind:value={debitor.nama}
						placeholder="Nama"
						class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'nama') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
					/>
					{#if form?.errors?.find((error) => error.field === 'nama')}
						<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
							{form?.errors?.find((error) => error.field === 'nama').message}
						</p>
					{/if}
				</div>
				<div>
					<label
						for="tglSidang"
						class={`mb-2 block text-sm font-medium ${form?.errors?.find((error) => error.field === 'tglSidang') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
						>Tanggal Sidang</label
					>
					<div class="relative">
						<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
							<svg
								class={`${form?.errors?.find((error) => error.field === 'tglSidang') ? 'text-red-900 dark:text-red-500' : 'text-gray-500 dark:text-gray-400'} h-4 w-4 `}
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"
								/>
							</svg>
						</div>
						<input
							id="tglSidang"
							datepicker
							datepicker-format="dd MM yyyy"
							datepicker-title="Tanggal Sidang"
							datepicker-autohide
							type="text"
							bind:value={debitor.tglSidang}
							name="tglSidang"
							class={`block w-full rounded-lg border p-2.5 ps-10 text-sm ${form?.errors?.find((error) => error.field === 'tglSidang') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
							placeholder="Pilih Tanggal Sidang"
						/>
					</div>
					{#if form?.errors?.find((error) => error.field === 'tglSidang')}
						<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
							{form?.errors?.find((error) => error.field === 'tglSidang').message}
						</p>
					{/if}
				</div>
				<div>
					<label
						for="tempatSidang"
						class={`mb-2 block space-y-2 text-sm font-medium ${form?.errors?.find((error) => error.field === 'tempatSidang') ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
					>
						<span>Alamat</span>
						<textarea
							id="textarea-id"
							placeholder="Tempat Sidang"
							rows="2"
							bind:value={debitor.tempatSidang}
							name="tempatSidang"
							class={`block w-full rounded-lg border p-2.5 text-sm ${form?.errors?.find((error) => error.field === 'tempatSidang') ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
						></textarea>
						{#if form?.errors?.find((error) => error.field === 'tempatSidang')}
							<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
								{form?.errors?.find((error) => error.field === 'tempatSidang').message}
							</p>
						{/if}
					</label>
				</div>
				<Button type="submit" class="w-full md:w-fit">Ubah</Button>
			</form>
		</div>
	</div>
</div>
