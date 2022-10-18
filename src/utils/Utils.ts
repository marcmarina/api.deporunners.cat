import crypto from 'crypto';
import { Document } from 'mongoose';

export const generateToken = (size: number) => {
  return crypto.randomBytes(size).toString('hex');
};

export const getModelName = (model: Document) =>
  (model.constructor as unknown as Document).modelName;

export const randomInt = (min: number, max: number) =>
  Math.random() * (max - min + 1) + min;
