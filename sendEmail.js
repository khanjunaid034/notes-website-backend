import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'powermasteraws@gmail.com',
        pass: process.env.GMAIL_PASSWORD,
    }
})

export { transporter };