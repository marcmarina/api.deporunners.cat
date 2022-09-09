import crypto from 'crypto';
import pug from 'pug';
import pathNode from 'path';
import CSSInliner from 'css-inliner';
import { Document } from 'mongoose';

export const generateToken = (size: number) => {
  return crypto.randomBytes(size).toString('hex');
};

export const getModelName = (model: Document) =>
  (model.constructor as unknown as Document).modelName;

export const getPugTemplate = async (path: string, data?: any) => {
  const html = pug.renderFile(
    pathNode.normalize(`${process.cwd()}/public/emails/${path}`),
    {
      ...data,
    }
  );
  const inliner = new CSSInliner();
  return await inliner.inlineCSSAsync(html);
};

export const randomInt = (min: number, max: number) =>
  Math.random() * (max - min + 1) + min;
