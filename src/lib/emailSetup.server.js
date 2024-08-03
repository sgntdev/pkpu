import nodemailer from "nodemailer";
import { SMTP_PASSWORD, SMTP_EMAIL } from "$env/static/private";

let transporter = nodemailer.createTransport({
  host: "mail.kuantis.com",
  port: 465,
  secure: true,
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD,
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.error(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

export default transporter;
