import nodemailer from "nodemailer";
import { SMTP_PASSWORD, SMTP_EMAIL } from "$env/static/private";

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  },
  // logger: true,
  // debug: true
});

transporter.verify(function (error, success) {
  if (error) {
    console.error(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export default transporter;
