import { Maybe } from '@deporunners/utils';

export function fetchNullableVariable(key: string): Maybe<string> {
  return process.env[key] ?? null;
}

export function fetchVariable(key: string): string {
  const value = process.env[key];

  if (!value) throw new Error(`Could not fetch environment variable ${key}`);

  return value;
}
