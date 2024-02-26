import { SITE_URL } from '$env/static/private';
import transporter from '$lib/emailSetup.server.js';
import { prisma } from '$lib/prisma.server.js';

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

export const actions = {
	sendEmail: async ({ request }) => {
		try {
			const formData = await request.formData();
			const email = formData.get('email');

            const existingUser = await prisma.users.findUnique({
                where: { email },
                select: {
                    id: true,
                    uniqueCode: true,
                  },
            });

            let uniqueId, uniqueCode;

            if (!existingUser){
                uniqueId = await generateUniqueRandomId(5);
                uniqueCode = await generateUniqueCode(25);
                await prisma.users.create({
                    data: {
                        email,
                        id: uniqueId,
                        uniqueCode,
                        role: 'user'
                    }
                });
            }else{
                uniqueId = existingUser.id
                uniqueCode = existingUser.uniqueCode
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

			return {
				success: 'Email is sent'
			};
		} catch (error) {
			console.error(error);
			return {
				error: 'Failed to send email'
			};
		}
	}
};
