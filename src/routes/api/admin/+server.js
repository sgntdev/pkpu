import { SITE_URL } from '$env/static/private';
import transporter from '$lib/emailSetup.server.js';
import { prisma } from '$lib/prisma.server.js';
import { SECRET_INGREDIENT } from '$env/static/private';
import jwt from 'jsonwebtoken';

// export async function GET({ request }) {
// 	let token = request.headers.get('authorization');
// 	const url = new URL(request.url);
// 	const roleId = url.searchParams.get('roleId');
// 	if (token && token.startsWith('Bearer ')) {
// 		token = token.slice(7, token.length);
// 	}
// 	if (!token) {
// 		return new Response(JSON.stringify({ success: false, code: 401, message: 'Unauthorized' }), {
// 			status: 401
// 		});
// 	}
// 	let decoded = jwt.verify(token, SECRET_INGREDIENT);
// 	if (decoded.user.roleId !== 1) {
// 		return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
// 			status: 403
// 		});
// 	}
// 	let userQuery = {
// 		orderBy: { id: 'asc' },
// 		include: {
// 			Role: true
// 		}
// 	};

// 	if (roleId) {
// 		userQuery.where = {roleId : parseInt(roleId)};
// 	}
// 	const users = await prisma.user.findMany(userQuery);
// 	if (!users) {
// 		return new Response(
// 			JSON.stringify({ success: false, code: 404, message: 'Users tidak ditemukan!' }),
// 			{
// 				status: 404
// 			}
// 		);
// 	}
// 	return new Response(JSON.stringify({ success: true, message: 'Berhasil', data: users }), {
// 		status: 200
// 	});
// }

async function generateUniqueCode(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';

	// Generate a unique code
	while (true) {
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			result += characters.charAt(randomIndex);
		}

		// Check if the generated code already exists in the database
		const existingUser = await prisma.UserVerify.findFirst({
			where: { uniqueCode: result }
		});

		if (!existingUser) {
			// If the code is unique, break out of the loop
			break;
		} else {
			// If the code already exists, reset and try generating a new one
			result = '';
		}
	}

	return result;
}

const sendEmail = async (message) => {
	try {
		return await transporter.sendMail(message);
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export async function POST({ request }) {
	const email = await request.json();
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const validation = {
		success: false,
		errors: []
	};
	let uniqueCode = null;
	try {
		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + 1);
		if (!email) {
			validation.errors.push({ field: 'email', message: 'Email tidak boleh kosong!' });
		} else if (!emailRegex.test(email)) {
			validation.errors.push({ field: 'email', message: 'Format email tidak valid!' });
		}
        const validAdmin = await prisma.User.findUnique({
            where: {email},
            select: {
                roleId:true
            }
        })

        if (!validAdmin) {
            validation.errors.push({ field: 'email', message: 'Email tidak ditemukan!' });
        }else if(validAdmin.roleId !== 1){
            validation.errors.push({ field: 'email', message: 'Email tidak ditemukan!' });
        }

		if (validation?.errors.length > 0) {
			return new Response(JSON.stringify(validation), { status: 400 });
		}

		const existingUser = await prisma.UserVerify.findUnique({
			where: { email }
		});

		if (!existingUser) {
			uniqueCode = await generateUniqueCode(25);
			await prisma.UserVerify.create({
				data: {
					email,
					uniqueCode,
					expirationDate: expirationDate.toISOString()
				}
			});
		} else {
			if (new Date(existingUser.expirationDate) < new Date()) {
				uniqueCode = await generateUniqueCode(25);
				await prisma.UserVerify.update({
					where: { email },
					data: {
						uniqueCode,
						expirationDate: expirationDate.toISOString()
					}
				});
			} else {
				uniqueCode = existingUser.uniqueCode;
			}
		}

		const link = `${SITE_URL}/verify/${uniqueCode}`;
		let html = `<h2>Hi!</h2><p>Click the following link to access the form: <a href="${link}">${link}</a></p>`;

		const message = {
			from: '"pkpu.co.id" <fotoarchive8@gmail.com>',
			to: email,
			bcc: 'www.pkpu.co.id',
			subject: 'Link to access PKPU',
			text: 'INI BODY',
			html: html
		};
		await sendEmail(message);
		return new Response(
			JSON.stringify({
				success: true,
				message: 'Email berhasil terkirim!'
			}),
			{ status: 200 }
		);
	} catch (error) {
        console.log(error);
		return new Response(
			JSON.stringify({
				success: false,
				code: 400,
				message: 'Email gagal dikirim!'
			}),
			{ status: 400 }
		);
	}
}
