import { prisma } from '$lib/prisma.server.js';

export async function GET({ params }) {
	const { uid } = params;
    let debitor = await prisma.debitor.findUnique({
		where: { uid }
	});
    if(!debitor){
        const allDebitor = await prisma.debitor.findMany()
        const debitorWithLink = allDebitor.map((debitor) => {
            const link = debitor.nama.replace(/\s/g, '-').toLowerCase();
            return {
                ...debitor,
                link
            };
        });
        debitor = debitorWithLink.find((data) => data.link === uid)
    }
	if (!debitor) {
		return new Response(
			JSON.stringify({ success: false, code: 404, message: 'Kode debitor tidak valid!' }),
			{
				status: 404
			}
		);
	}
	return new Response(
		JSON.stringify(
			{ success: true, message: 'Kode debitor valid!', data:debitor },
			{ status: 200 }
		)
	);
}
