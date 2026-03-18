import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    }
})

export { transporter };