import config from '../config/config';

import { validateToken } from './apiToken';

describe('apiToken middleware', () => {
  it('returns undefined when the token is valid', () => {
    const headers = {
      'x-api-token': config.apiToken,
    };

    expect(validateToken(headers)).toEqual(undefined);
  });

  it('throws error when no token is present', () => {
    const headers = {};

    expect(validateToken(headers)).toEqual({
      msg: 'No API Token provided',
      status: 401,
    });
  });

  it('throws error when given token is not valid', () => {
    const headers = {
      'x-api-token': 'randomToken',
    };

    expect(validateToken(headers)).toEqual({
      msg: 'API Token is not valid',
      status: 401,
    });
  });
});
