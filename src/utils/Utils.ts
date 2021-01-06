import crypto from 'crypto';
import { Document } from 'mongoose';
import pathNode from 'path';
import fs from 'fs';
import CSSInliner from 'css-inliner';
import pug from 'pug';

export const generateToken = (size: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size, (err, buffer) => {
      if (err) reject(err);
      const token = buffer.toString('hex');
      resolve(token);
    });
  });
};

export const mapToJSON = (map: Map<any, any>) => {
  const obj = {};
  map.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
};

export const paginateArray = (arr: any[], page: number, pageSize: number) =>
  arr.slice((page - 1) * pageSize, page * pageSize);

export const getModelName = (model: Document) =>
  ((model.constructor as unknown) as Document).modelName;
export const getPugTemplate = async (path: string, data?: any) => {
  const html = pug.renderFile(pathNode.resolve(process.cwd(), 'public', path), {
    ...data,
  });
  const inliner = new CSSInliner();
  return inliner.inlineCSSAsync(html);
};

export const randomInt = (min: number, max: number) =>
  Math.random() * (max - min + 1) + min;

export const deleteFile = (filePath: string) => {
  fs.unlink(filePath, err => {
    if (err) throw err;
  });
};
