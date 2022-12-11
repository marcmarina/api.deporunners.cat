import crypto from 'crypto';

import bcrypt from 'bcrypt';

export function generateToken(size: number) {
  return crypto.randomBytes(size).toString('hex');
}

export async function hashString(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function compareHash(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
