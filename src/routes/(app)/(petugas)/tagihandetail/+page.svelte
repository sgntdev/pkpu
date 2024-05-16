<script>
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Breadcrumb,
		BreadcrumbItem,
		Badge,
		Indicator,
		Button
	} from 'flowbite-svelte';
	import { slide } from 'svelte/transition';
	import { PlusSolid, BookmarkOutline } from 'flowbite-svelte-icons';
	export let data;
	const { sifatTagihanData } = data.body;
	const tagihan = [
		{
			id: 1,
			debitorId: 1,
			userId: 1,
			kreditorId: 1,
			pertanggal: '29 January 2024',
			hutangPokok: '1089000',
			bunga: '3000000',
			denda: '4214244',
			sifatTagihanId: 2,
			jumlahTagihan: 'Dijamin',
			mulaiTertunggak: '04 April 2024',
			jumlahHari: '1234',
			totalVoters: 0,
			verifiedVote: 0,
			objectionVote: 0,
			status: 0,
			Kreditor: {
				nama: 'PT Cahaya Sejahtera'
			},
			SifatTagihan: {
				sifat: 'Preferent'
			}
		},
		{
			id: 2,
			debitorId: 1,
			userId: 1,
			kreditorId: 1,
			pertanggal: '29 January 2024',
			hutangPokok: '1089000',
			bunga: '13000000',
			denda: '4214244',
			sifatTagihanId: 2,
			jumlahTagihan: 'Dijamin',
			mulaiTertunggak: '04 April 2024',
			jumlahHari: '1234',
			totalVoters: 0,
			verifiedVote: 0,
			objectionVote: 0,
			status: 0,
			Kreditor: {
				nama: 'PT Abadi'
			},
			SifatTagihan: {
				sifat: 'Preferent'
			}
		}
	];
	const dummy = [
		{
			id: 1,
			bunga: '3000000',
			Kreditor: {
				nama: 'Bunga'
			},
			SifatTagihan: {
				sifat: 'Preferent'
			}
		},
		{
			id: 1,
			bunga: '10000000',
			Kreditor: {
				nama: 'Tagihan'
			},
			SifatTagihan: {
				sifat: 'Preferent'
			}
		},
		{
			id: 1,
			bunga: '6000000',
			Kreditor: {
				nama: 'Denda'
			},
			SifatTagihan: {
				sifat: 'Preferent'
			}
		}
	];
	// const tagihan = data.body.tagihan;
	let tagihanInputsByRow = tagihan.map(() => []);

	let openRow;
	let details;

	const toggleRow = (i) => {
		openRow = openRow === i ? null : i;
	};

	const formatPrice = (price) => {
		if (typeof price !== 'string') {
			price = price.toString();
		}
		const digits = price.replace(/,/g, '');
		const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return formatted;
	};

	function tambahInput(index) {
		tagihanInputsByRow[index] = [
			...tagihanInputsByRow[index],
			{ nama: '', amount: 0, sifatTagihan: '' }
		];
	}

	function hapusInput(rowIndex, TagihanDetailIndex) {
		tagihanInputsByRow[rowIndex] = tagihanInputsByRow[rowIndex].filter(
			(_, i) => i !== TagihanDetailIndex
		);
	}

	function updateAmount(rowIndex, TagihanDetailIndex, event) {
		tagihanInputsByRow[rowIndex][TagihanDetailIndex].amount = event.target.value;
	}

	function submitForm(rowIndex) {
		console.log('Tagihan Detail yang disubmit:', tagihanInputsByRow[rowIndex]);
	}
</script>

<div class="space-y-4">
	<Breadcrumb aria-label="Default breadcrumb example" class="mb-4">
		<BreadcrumbItem href="/dashboard" home>Dashboard</BreadcrumbItem>
		<BreadcrumbItem>List Tagihan</BreadcrumbItem>
	</Breadcrumb>
	<div class="min-h-max overflow-hidden rounded-lg border border-gray-200 p-8 dark:border-gray-700">
		<div class="mb-4 flex flex-col items-start justify-between sm:mb-0 md:flex-row">
			<caption
				class="mb-2 bg-white text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white md:mb-5"
			>
				List Tagihan
				<p class="mt-1 text-sm font-light text-gray-500 dark:text-gray-400">
					Kelola semua tagihan.
				</p>
			</caption>
		</div>

		{#if tagihan.length === 0}
			<div
				class="border-1 flex w-full items-center justify-center rounded-md border border-gray-300 py-40"
			>
				<h1 class="text-md font-medium text-gray-400 dark:text-white">
					List tagihan masih kosong.
				</h1>
			</div>
		{:else}
			<Table>
				<TableHead>
					<TableHeadCell>No</TableHeadCell>
					<TableHeadCell>Nama Kreditur</TableHeadCell>
					<TableHeadCell>Sifat/Golongan Tagihan</TableHeadCell>
					<TableHeadCell>Hutang Pokok</TableHeadCell>
					<TableHeadCell>Bunga</TableHeadCell>
					<TableHeadCell>Denda</TableHeadCell>
					<TableHeadCell>Jumlah Tagihan Seluruhnya</TableHeadCell>
					<TableHeadCell>Mulai Tertunggak</TableHeadCell>
					<TableHeadCell>Status</TableHeadCell>
					<TableHeadCell>Tagihan</TableHeadCell>
					<TableBodyCell>Action</TableBodyCell>
				</TableHead>
				<TableBody ableBodyClass="divide-y">
					{#each tagihan as data, index (data)}
						<TableBodyRow on:click={() => toggleRow(index)}>
							<TableBodyCell>{index + 1}</TableBodyCell>
							<TableBodyCell>{data.Kreditor.nama}</TableBodyCell>
							<TableBodyCell>{data.SifatTagihan.sifat}</TableBodyCell>
							<TableBodyCell>Rp. {formatPrice(parseFloat(data.hutangPokok))}</TableBodyCell>
							<TableBodyCell>Rp. {formatPrice(parseFloat(data.bunga))}</TableBodyCell>
							<TableBodyCell>Rp. {formatPrice(parseFloat(data.denda))}</TableBodyCell>
							<TableBodyCell>{data.jumlahTagihan}</TableBodyCell>
							<TableBodyCell>{data.mulaiTertunggak}</TableBodyCell>
							<TableBodyCell>
								{#if data.status === 0}
									<Badge color="gray" rounded class="px-2.5 py-0.5">
										<Indicator color="dark" size="xs" class="me-1" />Pending
									</Badge>
								{:else if data.status === 1}
									<Badge color="green" rounded class="px-2.5 py-0.5">
										<Indicator color="green" size="xs" class="me-1" />Verified
									</Badge>
								{:else}
									<Badge color="red" rounded class="px-2.5 py-0.5">
										<Indicator color="red" size="xs" class="me-1" />Objection
									</Badge>
								{/if}
							</TableBodyCell>
							<TableBodyCell>
								<a
									href={`/tagihan/tagihan`}
									class="font-medium text-primary-600 hover:underline dark:text-primary-500"
									>Lihat Dokumen</a
								>
							</TableBodyCell>
							<TableBodyCell>
								<Button size="xs" on:click={() => tambahInput(index)}
									><PlusSolid class="me-2 h-5 w-5" />Tambah</Button
								>
							</TableBodyCell>
						</TableBodyRow>
						{#if openRow === index}
							<TableBodyRow on:dblclick={() => (details = index)}>
								<TableBodyCell colspan="10">
									{#each tagihanInputsByRow[index] as tagihanDetail, TagihanDetailIndex (tagihanDetail)}
										<div class="grid gap-4 sm:gap-6 md:grid-cols-3">
											<div>
												<label
													for="sifatTagihan"
													class={`mb-2 block text-sm font-medium text-gray-900 dark:text-white`}
													>Sifat/Golongan Tagihan</label
												>
												<select
													id="sifatTagihan"
													name="sifatTagihanId"
													bind:value={tagihanDetail.sifatTagihan}
													class={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
												>
													<option value="" selected disabled>Pilih Sifat Tagihan</option>
													{#each sifatTagihanData as { id, sifat }}
														<option value={id}>{sifat}</option>
													{/each}
												</select>
												<!-- {#if sifatTagihan.id === '' && form?.errors?.find((error) => error.field === 'sifatTagihanId')}
												<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
													{form?.errors?.find((error) => error.field === 'sifatTagihanId').message}
												</p>
											{/if} -->
											</div>
											<div>
												<label
													for="jumlahTagihan"
													class={`mb-2 block text-sm font-medium text-gray-900 dark:text-white`}
													>Tipe Detail Tagihan</label
												>
												<select
													id="jumlahTagihan"
													name="jumlahTagihan"
													bind:value={tagihanDetail.nama}
													class={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500`}
												>
													<option value="" selected disabled>Pilih Detail Tagihan</option>
													<option value="bunga">Bunga</option>
													<option value="denda">Denda</option>
													<option value="tagihan">Tagihan</option>
												</select>
												<!-- {#if sifatTagihan.jumlahTagihan === '' && form?.errors?.find((error) => error.field === 'jumlahTagihan')}
												<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
													{form?.errors?.find((error) => error.field === 'jumlahTagihan').message}
												</p>
											{/if} -->
											</div>
											<div>
												<label
													for="hutangPokok"
													class={`mb-2 block text-sm font-medium ${tagihanDetail.amount === '' ? 'text-red-700 dark:text-red-500' : 'text-gray-900 dark:text-white'}`}
													>Hutang Pokok</label
												>
												<div class="relative">
													<div
														class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-2.5"
													>
														<p
															class={`${tagihanDetail.amount === '' ? 'text-red-900 dark:text-red-500' : 'text-gray-500'}`}
														>
															Rp.
														</p>
													</div>
													<input
														type="text"
														name="hutangPokok"
														placeholder="Hutang Pokok"
														id="hutangPokok"
														bind:value={tagihanDetail.amount}
														on:input={(event) => updateAmount(index, TagihanDetailIndex, event)}
														class={`block w-full rounded-lg border p-2.5 ps-10 text-sm ${tagihanDetail.amount === '' ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500' : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500'}`}
													/>
												</div>
												<!-- {#if jumlahTagihan.hutangPokok === '' && form?.errors?.find((error) => error.field === 'hutangPokok')}
													<p class="mt-2 text-xs font-normal text-red-700 dark:text-red-500">
														{form?.errors?.find((error) => error.field === 'hutangPokok').message}
													</p>
												{/if} -->
											</div>
										</div>
										<div>
											<button on:click={() => hapusInput(index, TagihanDetailIndex)}>X</button>
										</div>
									{/each}
									{#if tagihanInputsByRow[index].length > 0}
										<Button size="xs" on:click={() => submitForm(index)}>SUBMIT</Button>
									{/if}
								</TableBodyCell>
							</TableBodyRow>
							<TableBodyRow>
								<TableBodyCell colspan="9">
									<Table shadow>
										<TableHead>
											<TableHeadCell>No</TableHeadCell>
											<TableHeadCell>Sifat/Golongan Tagihan</TableHeadCell>
											<TableHeadCell>Tipe Detail Tagihan</TableHeadCell>
											<TableHeadCell>Amount</TableHeadCell>
											<TableBodyCell>Action</TableBodyCell>
										</TableHead>
										<TableBody>
											{#each dummy as data, index (data)}
												<TableBodyRow on:click={() => toggleRow(index)}>
													<TableBodyCell>{index + 1}</TableBodyCell>
													<TableBodyCell>{data.SifatTagihan.sifat}</TableBodyCell>
													<TableBodyCell>{data.Kreditor.nama}</TableBodyCell>
													<TableBodyCell>Rp. {formatPrice(parseFloat(data.bunga))}</TableBodyCell>
													<TableBodyCell>
														<Button size="xs" on:click={() => tambahInput(index)}
															><BookmarkOutline class="me-2 h-5 w-5" />Edit</Button
														>
													</TableBodyCell>
												</TableBodyRow>
											{/each}
										</TableBody>
										<tfoot style="border-top-width: 1px !important;">
											<tr class="font-semibold text-gray-900 dark:text-white">
												<td class="px-6 py-3"></td>
												<th scope="row" class="px-6 py-3 text-base" colspan="2">TOTAL:</th>
												<td class="px-6 py-3">Rp. {formatPrice(parseFloat(19000000))}</td>
											</tr>
										</tfoot>
									</Table>
								</TableBodyCell>
							</TableBodyRow>
						{/if}
						<!-- <TableBodyRow>
							<TableBodyCell></TableBodyCell>
							<TableBodyCell></TableBodyCell>
							<TableBodyCell>TOTAL :</TableBodyCell>
							<TableBodyCell
								>Rp. {formatPrice(
									parseFloat(data.denda) + parseFloat(data.hutangPokok) + parseFloat(data.bunga)
								)}</TableBodyCell
							>
						</TableBodyRow> -->
					{/each}
				</TableBody>
			</Table>
		{/if}
	</div>
</div>
