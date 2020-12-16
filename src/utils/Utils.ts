import crypto from 'crypto';
import { Document } from 'mongoose';

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
