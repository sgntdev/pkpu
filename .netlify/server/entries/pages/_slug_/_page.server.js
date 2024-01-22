import { G as GOOGLE_EMAIL, b as GOOGLE_EMAIL_PASSWORD, E as EMAIL_1, a as EMAIL_2, S as SITE_URL } from "../../../chunks/private.js";
import nodemailer from "nodemailer";
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: GOOGLE_EMAIL,
    pass: GOOGLE_EMAIL_PASSWORD
  }
});
transporter.verify(function(error, success) {
  if (error) {
    console.error(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
const actions = {
  sendEmail: async ({ request }) => {
    try {
      const formData = await request.formData();
      const email = formData.get("to");
      const defaultData = [
        {
          email: EMAIL_1,
          uniquecode: "fd82ja73h214db33",
          role: "admin"
        },
        {
          email: EMAIL_2,
          uniquecode: "k8d1d21hen1w43d",
          role: "user"
        }
      ];
      const user = defaultData.find((item) => item.email === email);
      const userId = "H78KF";
      const link = `${SITE_URL}/${userId}/${user.uniquecode}`;
      let html = `<h2>Hi!</h2><p>Click the following link to access the form: <a href="${link}">${link}</a></p>`;
      const message = {
        from: '"pkpu.co.id" <fotoarchive8@gmail.com>',
        to: email,
        bcc: "www.pkpu.co.id",
        subject: "Link to access Form Tagihan",
        text: "INI BODY",
        html
      };
      const sendEmail = async (message2) => {
        await new Promise((resolve, reject) => {
          transporter.sendMail(message2, (err, info) => {
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
        success: "Email is sent"
      };
    } catch (error) {
      console.error(error);
    }
  }
};
export {
  actions
};
