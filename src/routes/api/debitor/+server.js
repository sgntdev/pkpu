/** @type {import('./$types').RequestHandler} */
import { prisma } from '$lib/prisma.server.js';
export async function GET() {
    const debitor = await prisma.Debitor.findMany();
	return new Response(JSON.stringify(debitor), { status: 200 });
};