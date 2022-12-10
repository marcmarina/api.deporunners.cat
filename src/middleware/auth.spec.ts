import { signJWT } from '../authentication';
import { auth, getTokens } from './auth';

describe.skip('auth middleware', () => {
  it('throws an error when tokens are missing', () => {
    const req = {
      headers: {},
    };

    expect(() => {
      getTokens(req);
    }).toThrow();
  });

  it('extracts the correct tokens', () => {
    const req = {
      headers: {
        'x-refresh-token': 'refreshtoken',
        'x-auth-token': 'authtoken',
      },
    };

    expect(getTokens(req)).toStrictEqual({
      token: 'authtoken',
      refreshToken: 'refreshtoken',
    });
  });

  it('inserts right info in request', async () => {
    const user = {
      refreshToken: 'refreshToken',
      _id: '123123123',
    };

    const req = {
      headers: {
        'x-refresh-token': user.refreshToken,
        'x-auth-token': signJWT({ _id: user._id, modelName: 'User' }),
      },
    };

    const res = {
      headers: {},
      set(headers) {
        this.headers = {
          ...this.headers,
          ...headers,
        };
      },
    };
    const next = jest.fn();
    auth(req, res, next);

    expect(res.headers).toHaveProperty('x-auth-token');
  });
});
