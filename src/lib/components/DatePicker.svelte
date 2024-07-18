<script>
	import { DatePicker } from '@svelte-plugins/datepicker';
	import { format } from 'date-fns';

	export let startDate = null;
	export let dateFormat = 'dd MMMM yyyy';
	export let isOpen = false;

	const toggleDatePicker = () => (isOpen = !isOpen);

	const formatDate = (dateString) => {
		return (dateString && format(new Date(dateString), dateFormat)) || '';
	};

	let formattedStartDate = formatDate(startDate);

	$: formattedStartDate = formatDate(startDate);
</script>

<DatePicker bind:isOpen bind:startDate>
	<input
		type="text"
		class="datepicker"
		placeholder="Pilih tanggal"
		bind:value={formattedStartDate}
		on:click={toggleDatePicker}
	/>
</DatePicker>

<style>
	.datepicker {
		border: 1px solid rgb(209 213 219 / var(--tw-border-opacity));
		border-radius: 0.5rem;
		padding: 0.625rem;
		width: 100%;
		color: rgb(17 24 39 / var(--tw-text-opacity));
		background-color: rgb(249 250 251 / var(--tw-bg-opacity));
		line-height: 1.25rem;
		font-size: 0.875rem;
	}
	.datepicker:focus {
		border-color: rgb(63 131 248 / var(--tw-border-opacity));
	}
</style>
