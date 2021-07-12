import crypto from 'crypto';
import pug from 'pug';
import pathNode from 'path';
import CSSInliner from 'css-inliner';
import fs from 'fs';
import { Document } from 'mongoose';

export const generateToken = (size: number) => {
  return crypto.randomBytes(size).toString('hex');
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
  (model.constructor as unknown as Document).modelName;

export const getPugTemplate = async (path: string, data?: any) => {
  const html = pug.renderFile(
    pathNode.resolve(`${process.cwd()}\\public\\${path}`),
    {
      ...data,
    }
  );
  const inliner = new CSSInliner();
  return await inliner.inlineCSSAsync(html);
};

export const randomInt = (min: number, max: number) =>
  Math.random() * (max - min + 1) + min;

export const deleteFile = (filePath: string) => {
  fs.unlink(filePath, err => {
    if (err) throw err;
  });
};

export async function promiseHandling<T>(promise: Promise<T>): Promise<{
  data: T | null;
  error: Error | null;
}> {
  try {
    const data = await promise;

    return {
      data,
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error,
    };
  }
}
