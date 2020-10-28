import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

import 'dotenv/config';

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  }),
  {
    from: process.env.EMAIL_FROM,
  }
);

export default transporter;
