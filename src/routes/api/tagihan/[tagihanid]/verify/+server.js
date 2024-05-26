import { prisma } from '$lib/prisma.server.js';
import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';

export async function POST({ params, request }) {
	let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ success: false, code: 401, message: 'Unauthorized' }), {
			status: 401
		});
	}
	const tagihanId = parseInt(params.tagihanid);
	const data = await request.json();
	const vote = parseInt(data.tagihanStatus);
	const validation = {
		success: false,
		errors: []
	};
	try {
		let decoded = jwt.verify(token, SECRET_INGREDIENT);
		if (decoded.user.roleId !== 1) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
		if (!data.tagihanStatus) {
			validation.errors.push({
				field: 'tagihanStatus',
				message: 'Status tagihan tidak boleh kosong!'
			});
		}
		if (!data.password) {
			validation.errors.push({ field: 'password', message: 'Password tidak boleh kosong!' });
		}
		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation));
		}
		const verify = await prisma.verified.findFirst();
		if (verify === null) {
			return new Response(
				JSON.stringify({ success: false, message: 'Password verify tidak ditemukan!' }),
				{
					status: 400
				}
			);
		}
		if (data.password !== verify.password) {
			return new Response(JSON.stringify({ success: false, message: 'Password verify salah!' }), {
				status: 400
			});
		} else {
			const tagihan = await prisma.tagihan.findUnique({
				where: { id: tagihanId },
				include:{
					Debitor:{
						select:{
							petugasAccess : true
						}
					}
				}
			});

			let objectionVote = tagihan.objectionVote;
			let verifiedVote = tagihan.verifiedVote;
			let totalVoters = tagihan.Debitor.petugasAccess.length;
			if (vote === 0) {
				objectionVote++;
			} else {
				verifiedVote++;
			}

			const updatedTagihan = await prisma.tagihan.update({
				where: {
					id: tagihanId
				},
				data: {
					objectionVote,
					verifiedVote,
					totalVoters
				}
			});

			const minimVoters = Math.floor(updatedTagihan.totalVoters / 2) + 1;

			let status = 0;
			if (updatedTagihan.verifiedVote >= minimVoters) {
				status = 1;
			} else if (updatedTagihan.verifiedVote >= minimVoters) {
				status = 2;
			}

			await prisma.Tagihan.update({
				where: { id: tagihanId },
				data: { status }
			});

			await prisma.tagihanVote.create({
				data: {
					tagihanId,
					userId: parseInt(data.userId),
					vote
				}
			});

			const tagihanJoin = await prisma.Tagihan.findUnique({
				where: { id: tagihanId },
				include: {
					SifatTagihan: {
						select: {
							sifat: true
						}
					},
					Kreditor: true,
					DokumenTagihan: {
						select: {
							tipeDokumenId: true,
							nama_dokumen: true,
							dokumen_url: true,
							TipeDokumen: {
								select: {
									tipe: true
								}
							}
						}
					},
					TagihanVote : {
						where : {userId : decoded.user.id}
					}
				}
			});

			return new Response(
				JSON.stringify({ success: true, message: 'Proses verify berhasil!', data: tagihanJoin }),
				{
					status: 200
				}
			);
		}
	} catch (error) {
		console.log(error)
		return new Response(
			JSON.stringify({ success: false, code: 500, message: 'Proses verify gagal!' }),
			{ status: 500 }
		);
	}
}

export async function PUT({ params, request }) {
	let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ success: false, code: 401, message: 'Unauthorized' }), {
			status: 401
		});
	}
	const tagihanId = parseInt(params.tagihanid);
	const data = await request.json();
	const validation = {
		success: false,
		errors: []
	};
	try {
		let decoded = jwt.verify(token, SECRET_INGREDIENT);
		if (decoded.user.roleId !== 1) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}
		if (!data.tagihanStatus) {
			validation.errors.push({
				field: 'tagihanStatus',
				message: 'Status tagihan tidak boleh kosong!'
			});
		}
		if (!data.password) {
			validation.errors.push({ field: 'password', message: 'Password tidak boleh kosong!' });
		}
		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation));
		}
		const verify = await prisma.verified.findFirst();
		if (verify === null) {
			return new Response(
				JSON.stringify({ success: false, message: 'Password verify tidak ditemukan!' }),
				{
					status: 400
				}
			);
		}
		if (data.password !== verify.password) {
			return new Response(JSON.stringify({ success: false, message: 'Password verify salah!' }), {
				status: 400
			});
		} else {
			await prisma.Tagihan.update({
				where: { id: tagihanId },
				data: {
					status: parseInt(data.tagihanStatus)
				}
			});
			const tagihanJoin = await prisma.Tagihan.findUnique({
				where: { id: tagihanId },
				include: {
					SifatTagihan: {
						select: {
							sifat: true
						}
					},
					Kreditor: true,
					DokumenTagihan: {
						select: {
							tipeDokumenId: true,
							nama_dokumen: true,
							dokumen_url: true,
							TipeDokumen: {
								select: {
									tipe: true
								}
							}
						}
					},
					TagihanVote : {
						where : {userId : decoded.user.id}
					}
				}
			});
			return new Response(
				JSON.stringify({ success: true, message: 'Proses verify berhasil!', data: tagihanJoin }),
				{
					status: 200
				}
			);
		}
	} catch (error) {
		console.log(error)
		return new Response(
			JSON.stringify({ success: false, code: 500, message: 'Proses verify gagal!' }),
			{ status: 500 }
		);
	}
}
