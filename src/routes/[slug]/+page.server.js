import { SITE_URL, EMAIL_1, EMAIL_2 } from "$env/static/private";
import transporter from "$lib/emailSetup.server.js";

export const actions = {
    sendEmail: async ({ request }) => {
        try {
            const formData = await request.formData();
            const email = formData.get("to");

            const defaultData = [
                {
                    email : EMAIL_1,
                    uniquecode: 'fd82ja73h214db33',
                    role: 'admin'
                },
                {
                    email : EMAIL_2,
                    uniquecode: 'k8d1d21hen1w43d',
                    role: 'user'
                }
            ];
            const user = defaultData.find(item => item.email === email);
            // const subject = formData.get("subject");
            const userId = 'H78KF';
            const link = `${SITE_URL}/${userId}/${user.uniquecode}`;
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
 