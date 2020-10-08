import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

export default transporter;
