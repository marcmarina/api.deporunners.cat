import crypto from 'crypto';

export const generateToken = (size: number) => {
  return crypto.randomBytes(size).toString('hex');
};

export const randomInt = (min: number, max: number) =>
  Math.random() * (max - min + 1) + min;
