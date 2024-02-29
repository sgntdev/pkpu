import { SITE_URL } from '$env/static/private';
import transporter from '$lib/emailSetup.server.js';
import { prisma } from '$lib/prisma.server.js';
import { json, fail } from '@sveltejs/kit';

export async function GET() {
	return json('success');
}
async function generateUniqueRandomId(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';

	// Generate a unique ID
	while (true) {
		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			result += characters.charAt(randomIndex);
		}

		//   Check if the generated ID already exists in the database
		const existingUser = await prisma.users.findUnique({
			where: { id: result }
		});

		if (!existingUser) {
			// If the ID is unique, break out of the loop
			break;
		} else {
			// If the ID already exists, reset and try generating a new one
			result = '';
		}
	}

	return result;
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
		const existingUser = await prisma.users.findFirst({
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
    const formData = await request.formData();
    const email = formData.get('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validation = {
        success: false,
        errors: []
    };
	try {
        if(!email){
            validation.errors.push({ field: 'email', message: 'Email tidak boleh kosong!' });
        }else if (!emailRegex.test(email)) {
            validation.errors.push({ field: 'email', message: 'Format email tidak valid!' });
        }
        if (validation?.errors.length > 0) {
            return json(validation);
        }
		const existingUser = await prisma.users.findUnique({
			where: { email },
			select: {
				id: true,
				uniqueCode: true
			}
		});

		let uniqueId, uniqueCode;

		if (!existingUser) {
			uniqueId = await generateUniqueRandomId(5);
			uniqueCode = await generateUniqueCode(25);
			await prisma.users.create({
				data: {
					email,
					id: uniqueId,
					uniqueCode,
					roleId: 3
				}
			});
		} else {
			uniqueId = existingUser.id;
			uniqueCode = existingUser.uniqueCode;
		}

		const link = `${SITE_URL}/${uniqueId}/${uniqueCode}`;
		let html = `<h2>Hi!</h2><p>Click the following link to access the form: <a href="${link}">${link}</a></p>`;

		const message = {
			from: '"pkpu.co.id" <fotoarchive8@gmail.com>',
			to: email,
			bcc: 'www.pkpu.co.id',
			subject: 'Link to access Form Tagihan',
			text: 'INI BODY',
			html: html
		};
		await sendEmail(message);
		return json({ success: true });
	} catch (error) {
		console.error(error);
		return json({success: false});
	}
}
