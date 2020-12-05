import 'dotenv/config';

import User from '../models/User';
import { createSessionToken } from '../services/user';
import { generateNewJWT } from './SessionManagement';
import db from './db';

let user;

beforeAll(async () => {
  await db.connect(process.env.MONGODB_URI);

  user = await User.findOne({});

  if (!user.refreshToken) user = await createSessionToken(user);
});
afterAll(async () => {
  await db.disconnect();
});

test('returns a new JWT when given valid information', async () => {
  await expect(
    generateNewJWT(user._id, user.refreshToken, 'User')
  ).resolves.toBeDefined();
});

test('throws an error when wrong refresh token is given', async () => {
  await expect(
    generateNewJWT(user._id, 'invalid token', 'User')
  ).rejects.toEqual({
    status: 401,
    msg: 'Refresh token not valid',
  });
});

test('throws an error when wrong model name is given', async () => {
  await expect(
    generateNewJWT(user._id, user.refreshToken, 'Member')
  ).rejects.toEqual({
    status: 401,
    msg: 'Model id not valid',
  });
});
