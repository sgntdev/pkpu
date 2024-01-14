
import transporter from "$lib/emailSetup.server.js";

export const actions = {
    sendEmail: async ({ request }) => {
        try {
            const formData = await request.formData();
            const email = formData.get("to");
            // const subject = formData.get("subject");
            const userId = 'H78KF';
            const uniqueCode = 'k8d1d21hen1w43d';
            const link = `http://localhost:5173/${userId}/${uniqueCode}`;
            let html = `<h2>Hi!</h2><p>Click the following link to access the form: <a href="${link}">${link}</a></p>`;

            const message = {
                from: '"pkpu.co.id" <fotoarchive8@gmail.com>',
                to: email,
                bcc: "www.pkpu.co.id",
                subject: 'Link to access Form Tagihan',
                text: 'INI BODY',
                html: html,
                
            };

            const sendEmail = async (message) => {
                await new Promise((resolve, reject) => {
                    transporter.sendMail(message, (err, info) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                        } else {
                            resolve(info);
                        }
                    });
                });
            };

            await sendEmail(message);

            return {
                success: "Email is sent",
            };
        } catch (error) {
            console.error(error);
        }
    }
};
 