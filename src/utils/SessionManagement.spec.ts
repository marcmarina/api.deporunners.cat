import User from '../models/User';
import { generateNewJWT } from './SessionManagement';
import db from './db';
import 'dotenv/config';

beforeAll(async () => {
  await db.connect(process.env.MONGODB_URI);
});
afterAll(async () => {
  await db.disconnect();
});

test('returns a new JWT when given valid information', async () => {
  const user = await User.findOne({});
  expect(
    await generateNewJWT(user._id, user.refreshToken, 'User')
  ).toBeTruthy();
});

test('throws an error when wrong refresh token is given', async () => {
  const user = await User.findOne({});

  await expect(
    generateNewJWT(user._id, 'invalid token', 'User')
  ).rejects.toEqual({
    status: 401,
    msg: 'Refresh token not valid',
  });
});

test('throws an error when wrong model name is given', async () => {
  const user = await User.findOne({});

  await expect(
    generateNewJWT(user._id, user.refreshToken, 'Member')
  ).rejects.toEqual({
    status: 401,
    msg: 'Model id not valid',
  });
});
