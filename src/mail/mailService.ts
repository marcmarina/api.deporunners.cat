import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import pug from 'pug';
import pathNode from 'path';
import CSSInliner from 'css-inliner';

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

export const getTemplate = async (path: string, data?: any) => {
  const html = pug.renderFile(
    pathNode.resolve(`${__dirname}\\..\\..\\public\\emails\\${path}`),
    {
      ...data,
    }
  );
  const inliner = new CSSInliner();
  return inliner.inlineCSSAsync(html);
};

export default transporter;
