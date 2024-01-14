
import transporter from "$lib/emailSetup.server.js";

export const actions = {
    sendEmail: async ({ request }) => {
        try {
            const formData = await request.formData();
            const email = formData.get("to");
            // const subject = formData.get("subject");
            let html = `<h2>Hi!</h2><pre>TESTTT</pre>`;

            const message = {
                from: '"Kurator.id" <fotoarchive8@gmail.com>',
                to: email,
                bcc: "www.kurator.id",
                subject: 'Link to access Kurator.id',
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
 