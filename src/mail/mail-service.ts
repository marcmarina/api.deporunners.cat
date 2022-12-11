import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

import { config } from '../config';

export const mailService = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: config.sendgridKey,
    },
  }),
  {
    from: config.emailFrom,
  },
);
