import bcrypt from 'bcrypt';
import crypto from 'crypto';

export function generateToken(size: number) {
  return crypto.randomBytes(size).toString('hex');
}

export async function hashString(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export function hashStringSync(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export async function compareHash(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function randomUUID() {
  return crypto.randomUUID();
}
