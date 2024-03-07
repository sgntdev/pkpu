import { prisma } from '$lib/prisma.server.js';

export async function GET({params}) {
    const {debitorid} = params
    const id = parseInt(debitorid)
    const tagihan = await prisma.Tagihan.findMany({
        where : {debitorId: id}
    })
    return new Response(JSON.stringify(tagihan));
};