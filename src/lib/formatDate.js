import { formatISO, fromUnixTime, parseISO, getTime } from 'date-fns';

export function formatDate(timestamp, divider = '/') {
	const date = new Date(timestamp);
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();

	return `${day}${divider}${month}${divider}${year}`;
}

export function formatDateDay(timestamp) {
	const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
	const months = [
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
		'Desember'
	];

	const date = new Date(timestamp);
	const dayOfWeek = daysOfWeek[date.getDay()];
	const day = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear();

	return `${dayOfWeek}, ${day} ${month} ${year}`;
}

export function formatDateLocale(timestamp) {
	const months = [
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
		'Desember'
	];

	const date = new Date(timestamp);
	const day = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear();

	return `${day} ${month} ${year}`;
}

export function timestampToISO(timestamp) {
	const date = fromUnixTime(timestamp / 1000); 
	return formatISO(date);
}

