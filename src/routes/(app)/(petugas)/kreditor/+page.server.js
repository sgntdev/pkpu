import { prisma } from '$lib/prisma.server.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, fetch }) {
	const { user, token } = locals;
	if (!user) {
		redirect(303, '/');
	} else {
		if (user.roleId === 1 || user.roleId === 2) {
			const debitorResponse = await fetch('/api/debitor');
			const debitorResult = await debitorResponse.json();
			const users = await prisma.user.findMany();
			const kreditorJoinTagihan = await prisma.kreditor.findMany({
				include: {
					Tagihan: {
						select: {
							id: true,
							debitorId: true
						}
					}
				}
			});
			const processedData = kreditorJoinTagihan.map((kreditor) => {
				const debitorIds = kreditor.Tagihan.map((tagihan) => tagihan.debitorId);
				// Menghapus duplikat debitorId
				const uniqueDebitorIds = [...new Set(debitorIds)];
				// Menggabungkan debitorId menjadi satu string
				const mergedDebitorId = uniqueDebitorIds.join(', ');
				const userEmail = users.find((user) => user.id === kreditor.userId).email;
				return {
					id: kreditor.id,
					userEmail,
					nama: kreditor.nama,
					email: kreditor.email,
					alamat: kreditor.alamat,
					noTelp: kreditor.noTelp,
					debitorId: parseInt(mergedDebitorId)
				};
			});
			return {
				status: 200,
				body: {
					debitorData: debitorResult,
					kreditorData: processedData
				}
			};
		} else {
			error(404, 'Page Not Found');
		}
	}
}
