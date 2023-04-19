import { isNumber } from '@deporunners/utils';

export function randomInt(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

export function isANumber(value: unknown): value is number {
  return isNumber(value);
}
