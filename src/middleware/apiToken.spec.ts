import config from '../config/config';

import apiToken, { checkToken } from './apiToken';

it('middleware calls next without an exception when the token is present and valid', () => {
  const req = {
    headers: {
      'x-api-token': config.apiToken(),
    },
  };
  const next = jest.fn(ex => {
    expect(ex).not.toBeDefined();
  });

  apiToken(req, {}, next);
});

it('middleware calls next with an exception when the token is invalid', () => {
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

it('middleware calls next with an exception when the token is not provided', () => {
  const req = {
    headers: {},
  };
  const next = jest.fn(ex => {
    expect(ex).toEqual({ msg: 'No API Token provided', status: 401 });
  });

  apiToken(req, {}, next);
});

it('throws error when no token is present', () => {
  const req = {
    headers: {},
  };
  expect(() => {
    checkToken(req);
  }).toThrow();
});

it('throws error when given token is not valid', () => {
  const req = {
    headers: {
      'x-api-token': 'randomToken',
    },
  };
  expect(() => {
    checkToken(req);
  }).toThrow();
});

it("doesn't throw error when given token is valid", () => {
  const req = {
    headers: {
      'x-api-token': config.apiToken(),
    },
  };
  expect(() => {
    checkToken(req);
  }).not.toThrow();
});
