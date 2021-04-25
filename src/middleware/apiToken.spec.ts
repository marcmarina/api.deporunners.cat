import env from '../utils/environment';

import apiToken, { checkToken } from './apiToken';

test('middleware calls next without an exception when the token is present and valid', () => {
  const req = {
    headers: {
      'x-api-token': env.apiToken(),
    },
  };
  const next = jest.fn(ex => {
    expect(ex).not.toBeDefined();
  });

  apiToken(req, {}, next);
});

test('middleware calls next with an exception when the token is invalid', () => {
  const req = {
    headers: {
      'x-api-token': 'invalidtoken',
    },
  };
  const next = jest.fn(ex => {
    expect(ex).toEqual({ msg: 'API Token is not valid', status: 401 });
  });

  apiToken(req, {}, next);
});

test('middleware calls next with an exception when the token is not provided', () => {
  const req = {
    headers: {},
  };
  const next = jest.fn(ex => {
    expect(ex).toEqual({ msg: 'No API Token provided', status: 401 });
  });

  apiToken(req, {}, next);
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
      'x-api-token': env.apiToken(),
    },
  };
  expect(() => {
    checkToken(req);
  }).not.toThrow();
});
