import { config } from '@deporunners/config';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';

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
