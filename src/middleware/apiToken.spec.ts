import 'dotenv/config';

import { checkToken } from './apiToken';

test('throws error when no token is present', () => {
  const req = {
    headers: {},
  };
  expect(() => {
    checkToken(req);
  }).toThrow();
});

test('throws error when given token is not valid', () => {
  const req = {
    headers: {
      'x-api-token': 'randomToken',
    },
  };
  expect(() => {
    checkToken(req);
  }).toThrow();
});

test("doesn't throw error when given token is valid", () => {
  const req = {
    headers: {
      'x-api-token':
        '8ae4e38c36a7a84f09fef7321b83c5555e464e1a51335448898788c82dc613e9',
    },
  };
  expect(() => {
    checkToken(req);
  }).not.toThrow();
});
