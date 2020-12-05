import 'dotenv/config';

import User, { IUser } from '../models/User';
import { signJWT } from '../utils/SessionManagement';
import auth, { getTokens } from './auth';
import db from '../utils/db';
import { createSessionToken } from '../services/user';

let user: IUser;

beforeAll(async () => {
  await db.connect(process.env.MONGODB_URI);

  user = await User.findOne({});

  if (!user.refreshToken) user = await createSessionToken(user);
});
afterAll(async () => {
  await db.disconnect();
});

test('throws an error when tokens are missing', () => {
  const req = {
    headers: {},
  };

  expect(() => {
    getTokens(req);
  }).toThrow();
});

test('extracts the correct tokens', () => {
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

test('inserts right info in request', async () => {
  const req = {
    headers: {
      'x-refresh-token': user.refreshToken,
      'x-auth-token': signJWT({ _id: user._id }, 'User'),
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

  expect(req['userId']).toBe(user._id.toString());
  expect(res.headers).toHaveProperty('x-auth-token');
});
