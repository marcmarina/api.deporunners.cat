import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import dotenv from 'dotenv';
import pug from 'pug';
import pathNode from 'path';
import CSSInliner from 'css-inliner';

dotenv.config();

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

export const getTemplate = async (path: string, data?: any) => {
  try {
    const html = pug.renderFile(
      pathNode.resolve(`${__dirname}\\..\\..\\public\\emails\\${path}`),
      {
        ...data,
      }
    );
    const inliner = new CSSInliner();
    return await inliner.inlineCSSAsync(html);
  } catch (ex) {
    throw ex;
  }
};

export default transporter;
