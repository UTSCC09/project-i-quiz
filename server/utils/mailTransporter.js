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

const defaultMailOptions = {
  from: process.env.AUTH_EMAIL
};

const backendUrl = process.env.SERVER_BASE_URL + "/";
const frontendUrl = process.env.CLIENT_BASE_URL + "/";

export { transporter, defaultMailOptions, backendUrl, frontendUrl };