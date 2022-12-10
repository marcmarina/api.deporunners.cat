import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import { config } from '../config';

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: config.sendgridKey,
    },
  }),
  {
    from: config.emailFrom,
  },
);

export default transporter;
