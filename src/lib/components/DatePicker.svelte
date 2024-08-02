<script>
	import { formatDateLocale } from '$lib/formatDate.js';
	import { DatePicker } from '@svelte-plugins/datepicker';

	export let startDate = null;
	export let isOpen = false;
	export let invalid = false;

	const toggleDatePicker = () => (isOpen = !isOpen);

	const formatDate = (dateString) => {
		return (dateString && formatDateLocale(dateString)) || '';
	};

	let formattedStartDate = formatDate(startDate);

	$: formattedStartDate = formatDate(startDate);
	let monthLabels = [
		'Januari',
		'Februari',
		'Maret',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Agustus',
		'September',
		'Oktober',
		'November',
		'Desemeber'
	];
	let dowLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
</script>

<DatePicker
	bind:isOpen
	bind:startDate
	enableFutureDates
	enablePastDates
	theme="custom-datepicker"
	{monthLabels}
	{dowLabels}
>
	<input
		type="text"
		class="datepicker {invalid ? 'invalid' : ''}"
		placeholder="Pilih tanggal"
		bind:value={formattedStartDate}
		on:click={toggleDatePicker}
	/>
</DatePicker>

<style>
	.datepicker {
		border: 1px solid rgb(209 213 219);
		border-radius: 0.5rem;
		padding: 0.625rem;
		width: 100%;
		color: rgb(17 24 39);
		background-color: rgb(249 250 251);
		line-height: 1.25rem;
		font-size: 0.875rem;
	}
	.datepicker:focus {
		border-color: rgb(63 131 248);
	}
	.datepicker.invalid {
		border-color: rgb(240 82 82);
		background-color: rgb(253 242 242);
		--tw-ring-color: rgb(240 82 82);
		color: rgb(119 29 29);
	}
	.datepicker:focus.invalid {
		border-color: rgb(240 82 82);
	}
	.datepicker.invalid::placeholder {
		color: rgb(200 30 30);
	}

	:global(.datepicker[data-picker-theme='custom-datepicker']) {
		/* --datepicker-container-background: #5f0730;
    --datepicker-container-border: 1px solid #ff1683; */

		/* --datepicker-calendar-header-text-color: #fff;
    --datepicker-calendar-dow-color: #fff;
    --datepicker-calendar-day-color: #fff; */
		/* --datepicker-calendar-day-color-disabled: pink; */
		--datepicker-calendar-range-selected-background: rgb(26 86 219);

		/* --datepicker-calendar-header-month-nav-background-hover: #ff1683;
    --datepicker-calendar-header-month-nav-icon-next-filter: invert(100);
    --datepicker-calendar-header-month-nav-icon-prev-filter: invert(100);
    --datepicker-calendar-header-year-nav-icon-next-filter: invert(100);
    --datepicker-calendar-header-year-nav-icon-prev-filter: invert(100); */

		/* --datepicker-calendar-split-border: 1px solid pink;

    --datepicker-presets-border: 1px solid pink;
    --datepicker-presets-button-background-active: #ff1683;
    --datepicker-presets-button-color: #fff;
    --datepicker-presets-button-color-active: #fff;
    --datepicker-presets-button-color-hover: #333;
    --datepicker-presets-button-color-focus: #333; */
	}
</style>
