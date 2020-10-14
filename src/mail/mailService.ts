import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import dotenv from 'dotenv';
import pug from 'pug';
import pathNode from 'path';
import inlineCss from 'inline-css';

dotenv.config();

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

export const getTemplate = async (path: string, data?: any) => {
  const html = pug.renderFile(
    pathNode.resolve(`${__dirname}\\..\\..\\public\\emails\\${path}`),
    {
      ...data,
    }
  );
  return await inlineCss(html, {
    url: '/',
  });
};

export default transporter;
