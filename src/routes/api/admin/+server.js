import { SITE_URL } from '$env/static/private';
import transporter from '$lib/emailSetup.server.js';
import { prisma } from '$lib/prisma.server.js';

async function readTemplate(templateName, replacements) {
	const response = await fetch(`${SITE_URL}/email-templates/${templateName}`);
	let template = await response.text();

	for (const [key, value] of Object.entries(replacements)) {
		template = template.replace(`{{${key}}}`, value);
	}
	return template;
}

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
	const { debitorUid, email } = await request.json();
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
			where: { email },
			select: {
				roleId: true
			}
		});

		if (!validAdmin) {
			validation.errors.push({ field: 'email', message: 'Email tidak ditemukan!' });
		} else if (validAdmin.roleId !== 1) {
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

		let nama = email.slice(0, email.indexOf('@'));
		const link = debitorUid ? `${SITE_URL}/verify/${debitorUid}/${uniqueCode}` : `${SITE_URL}/verify/${uniqueCode}`;
		const replacements = {
			nama,
			link
		};
		const templatePath = 'admin-verified.html';
		const html = await readTemplate(templatePath, replacements);

		const message = {
			from: '"PKPU" <pkpu@kuantis.com>',
			to: email,
			subject: 'Link akses halaman admin',
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
