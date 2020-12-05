import 'dotenv/config';

import apiToken, { checkToken } from './apiToken';

test('middleware calls next when the token is present and valid', () => {
  const req = {
    headers: {
      'x-api-token': process.env.API_TOKEN,
    },
  };
  const next = jest.fn();

  apiToken(req, {}, next);
  expect(next).toBeCalled();
});

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
      'x-api-token': process.env.API_TOKEN,
    },
  };
  expect(() => {
    checkToken(req);
  }).not.toThrow();
});
