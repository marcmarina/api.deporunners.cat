import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import env from '../utils/environment';

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: env.sendgridKey(),
    },
  }),
  {
    from: env.emailFrom(),
  }
);

export default transporter;
