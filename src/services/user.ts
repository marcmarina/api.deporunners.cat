import bcrypt from 'bcrypt';

import { signJWT } from '../authentication';
import { AuthError } from '../errors';
import { User, IUser } from '../models';
import { generateToken } from '../utils';

type Session = {
  authToken: string;
  refreshToken: string;
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return User.find();
};

export const findById = async (id: string) => {
  return await User.findById(id);
};

export const createUser = async (user: IUser): Promise<IUser> => {
  const hashedPassword = await bcrypt.hash(user.password, 12);
  user.password = hashedPassword;

  return user.save();
};

export const loginWithEmail = async (email: string, password: string) => {
  let user = await User.findOne({ email });

  if (!user) {
    throw new AuthError('These credentials are invalid.');
  }
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw new AuthError('These credentials are invalid.');
  }

  if (!user.refreshToken) {
    user = await createSessionToken(user);
  }

  const token = signJWT({ _id: user._id, modelName: 'User' });

  return {
    authToken: token,
    refreshToken: user.refreshToken,
  };
};

export const loginV2 = async (
  email: string,
  password: string,
): Promise<Session | null> => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isPasswordValid = await validatePassword(password, user.password);
  if (!isPasswordValid) return null;

  const session = await createSession(user);

  user.refreshToken = session.refreshToken;
  await user.save();

  return session;
};

const validatePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compareSync(password, hash);
};

const createSession = async (user: IUser) => {
  return {
    authToken: signJWT(user),
    refreshToken: user.refreshToken ?? generateToken(32),
  };
};

export const updatePassword = async (
  id: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await User.findById(id);
  if (!user)
    throw {
      status: 400,
      msg: 'The user id is not valid',
    };

  const validPassword = await bcrypt.compare(oldPassword, user.password);
  if (!validPassword)
    throw {
      status: 400,
      msg: 'The old password is not valid',
    };

  user.password = await bcrypt.hash(newPassword, 12);
  return user.save();
};

export const createSessionToken = async (user: IUser) => {
  const refreshToken = generateToken(64);
  user.refreshToken = refreshToken;
  return await user.save();
};
