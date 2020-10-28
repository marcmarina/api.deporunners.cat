import crypto from 'crypto';
import pug from 'pug';
import pathNode from 'path';
import CSSInliner from 'css-inliner';

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

export const getPugTemplate = async (path: string, data?: any) => {
  const html = pug.renderFile(
    pathNode.resolve(`${process.cwd()}\\public\\${path}`),
    {
      ...data,
    }
  );
  const inliner = new CSSInliner();
  return inliner.inlineCSSAsync(html);
};

export const randomInt = (min: number, max: number) =>
  Math.random() * (max - min + 1) + min;
