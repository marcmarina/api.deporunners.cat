import 'dotenv/config';

import { loginWithEmail, createSessionToken } from './user';
import db from '../utils/db';
import User, { IUser } from '../models/User';

let user: IUser;

beforeAll(async () => {
  await db.connect(process.env.MONGODB_URI);

  user = await User.findOne({});

  if (!user.refreshToken) user = await createSessionToken(user);
});
afterAll(async () => {
  await db.disconnect();
});

test('gives a JWT if valid credentials are provided', async () => {
  await expect(loginWithEmail('john@doe.com', '123456')).resolves.toBeDefined();
});

test('throws an error when non valid password is provided', async () => {
  await expect(loginWithEmail('john@doe.com', 'wrongpassword')).rejects.toEqual(
    {
      status: 400,
      msg: 'These credentials are invalid.',
    }
  );
});

test('throws an error when non email is provided', async () => {
  await expect(
    loginWithEmail('wrong@email.com', 'wrongpassword')
  ).rejects.toEqual({
    status: 400,
    msg: 'These credentials are invalid.',
  });
});
