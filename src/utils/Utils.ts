import crypto from 'crypto';
import pathNode from 'path';
import { Document } from 'mongoose';
import cons from 'consolidate';

export const generateToken = (size: number) => {
  return crypto.randomBytes(size).toString('hex');
};

export const getModelName = (model: Document) =>
  (model.constructor as unknown as Document).modelName;

export const getPugTemplate = (path: string, data?: any) => {
  return cons.pug(
    pathNode.normalize(`${process.cwd()}/public/emails/${path}`),
    {
      ...data,
    }
  );
};

export const randomInt = (min: number, max: number) =>
  Math.random() * (max - min + 1) + min;
