import { SITE_URL, SECRET_INGREDIENT } from '$env/static/private';
import transporter from '$lib/emailSetup.server.js';
import { prisma } from '$lib/prisma.server.js';
import jwt from 'jsonwebtoken';

async function readTemplate(templateName, replacements) {
	const response = await fetch(`${SITE_URL}/email-templates/${templateName}`);
	let template = await response.text();

	for (const [key, value] of Object.entries(replacements)) {
		template = template.replace(`{{${key}}}`, value);
	}
	return template;
}

const sendEmail = async (message) => {
	try {
		return await transporter.sendMail(message);
	} catch (error) {
		console.error(error);
		throw error;
	}
};

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
		const existingUser = await prisma.VerifiedPassword.findFirst({
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

export async function POST({ request }) {
	let token = request.headers.get('authorization');
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}
	if (!token) {
		return new Response(JSON.stringify({ success: false, code: 401, message: 'Unauthorized' }), {
			status: 401
		});
	}
	const userId = await request.json();
	let uniqueCode = null;
	try {
		let decoded = jwt.verify(token, SECRET_INGREDIENT);
		if (decoded.user.roleId !== 1 && decoded.user.roleId !== 2) {
			return new Response(JSON.stringify({ success: false, code: 403, message: 'Forbidden' }), {
				status: 403
			});
		}

		const expirationDate = new Date();
		expirationDate.setHours(expirationDate.getHours() + 2);

		const existingPassword = await prisma.VerifiedPassword.findUnique({
			where: { userId },
			select: {
				id: true,
				expirationDate: true,
				uniqueCode: true,
				User: {
					select: {
						email: true
					}
				}
			}
		});
		if (existingPassword) {
			if (new Date(existingPassword.expirationDate) < new Date()) {
				uniqueCode = await generateUniqueCode(25);
				await prisma.VerifiedPassword.update({
					where: { id: existingPassword.id },
					data: {
						uniqueCode,
						expirationDate: expirationDate.toISOString()
					}
				});
			} else {
				uniqueCode = existingPassword.uniqueCode;
			}
		}

		const link = `${SITE_URL}/resetpassword/${uniqueCode}`;
		const templatePath = 'password-reset.html';
		const html = await readTemplate(templatePath, { link });

		const message = {
			from: '"PKPU" <fotoarchive8@gmail.com>',
			to: existingPassword.User.email,
			subject: 'Atur ulang kata sandi verifikasi tagihan',
			html: html
		};
		await sendEmail(message);
		return new Response(
			JSON.stringify({ success: true, message: 'Reset link sent successfully, check your email!' })
		);
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ success: false, code: 400, message: 'Reset link failed to sent!' })
		);
	}
}
