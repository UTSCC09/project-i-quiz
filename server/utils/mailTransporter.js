import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false, 
    port: 587, 
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS
    }
});

const mailOptions = {
  from: process.env.AUTH_EMAIL
};

export { transporter, mailOptions };