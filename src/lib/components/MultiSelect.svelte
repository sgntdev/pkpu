<script>
	import { onMount, onDestroy } from 'svelte';

	export let options;
	export let value = [];
	export let selected = null;
	export let invalid = false;
	let toggleDropdown = false;
	let keyword = '';

	const showDropdown = () => {
		toggleDropdown = true;
	};

	const addItem = (item) => {
		if (!value.includes(item)) {
			value = [...value, item];
		} else {
			value = value.filter((i) => i !== item);
		}
	};

	const removeItem = (item) => {
		value = value.filter((i) => i !== item);
	};

	const clearItem = () => {
		value = [];
	};
	$: filteredData = options.filter(
		(item) =>
			!value.includes(item.value) && item.label.toLowerCase().includes(keyword.toLowerCase())
	);
	$: displayedSelectedItems = options.filter((item) => value.includes(item.value));
	
	$: if (selected) {
		value = selected;
	}

	const handleClickOutside = (event) => {
		const dropdown = document.getElementById('dropdownSearch');
		const button = document.getElementById('dropdownSearchButton');
		if (dropdown && !dropdown.contains(event.target) && !button.contains(event.target)) {
			toggleDropdown = false;
		}
	};
	onMount(() => {
		if (typeof document !== 'undefined') {
			document.addEventListener('click', handleClickOutside);
		}
	});

	onDestroy(() => {
		if (typeof document !== 'undefined') {
			document.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<div class="relative">
	<button
		id="dropdownSearchButton"
		on:click={showDropdown}
		class={`block w-full rounded-lg border p-2.5 text-sm ${invalid ? 'border-red-500 bg-red-50 text-red-700 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
		type="button"
	>
		<div class="flex w-full flex-row items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-3.5 w-3.5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
				/>
			</svg>
			<div class="flex w-full flex-row flex-wrap gap-2">
				{#if displayedSelectedItems.length > 0}
					{#each displayedSelectedItems as item}
						<span
							class={`${invalid ? 'bg-red-200 text-red-700' : 'bg-gray-200 text-gray-700'} flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium`}
						>
							{item.label}
							<button type="button" class="ml-1" on:click={() => removeItem(item.value)}>
								&times;
							</button>
						</span>
					{/each}
				{:else}
					<span class={`${invalid ? 'text-red-700 dark:text-red-500' : 'text-gray-500'}`}
						>Pilih pengurus</span
					>
				{/if}
			</div>
			{#if value.length > 0}
				<button type="button" on:click={clearItem}>
					<svg
						aria-hidden="true"
						class={`${invalid ? 'text-red-500 hover:text-red-700' : 'text-gray-400 hover:text-gray-900'} h-4 w-4`}
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						><path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"
						></path></svg
					>
					<span class="sr-only">Clear item</span>
				</button>
			{/if}
		</div>
	</button>

	<!-- Dropdown menu -->
	<div
		id="dropdownSearch"
		class={`${toggleDropdown ? 'block' : 'hidden'} absolute -top-44 z-10 w-full rounded-lg bg-white shadow dark:bg-gray-700 md:top-12`}
	>
		<div class="p-3">
			<label for="input-group-search" class="sr-only">Search</label>
			<div class="relative">
				<div
					class="rtl:inset-r-0 pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
				>
					<svg
						class="h-4 w-4 text-gray-500 dark:text-gray-400"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 20"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
						/>
					</svg>
				</div>
				<input
					type="text"
					bind:value={keyword}
					id="input-group-search"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
					placeholder="Cari pengurus"
				/>
			</div>
		</div>
		<ul
			class="max-h-28 overflow-y-auto px-3 text-sm text-gray-700 dark:text-gray-200"
			aria-labelledby="dropdownSearchButton"
		>
			{#if filteredData.length > 0}
				{#each filteredData as user}
					<li>
						<button
							type="button"
							on:click={() => addItem(user.value)}
							class="flex w-full rounded hover:bg-gray-100 dark:hover:bg-gray-600"
						>
							<span class="rounded p-2 text-sm font-medium text-gray-900 dark:text-gray-300"
								>{user.label}</span
							>
						</button>
					</li>
				{/each}
			{:else}
				<li class="w-full py-2 text-center">
					<span class="font-normal text-gray-400">Pengurus tidak ditemukan</span>
				</li>
			{/if}
		</ul>
	</div>
</div>
