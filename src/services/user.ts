import bcrypt from 'bcrypt';
import { Schema } from 'mongoose';

import User, { IUser } from '../models/User';
import { signJWT } from '../utils/SessionManagement';
import { generateToken } from '../utils/Utils';

export const getAllUsers = async (): Promise<IUser[]> => {
  return User.find();
};

export const findUserById = async (id: Schema.Types.ObjectId) => {
  return User.findById(id);
};

export const createUser = async (user: IUser): Promise<IUser> => {
  const hashedPassword = await bcrypt.hash(user.password, 12);
  user.password = hashedPassword;

  return user.save();
};

export const loginWithEmail = async (email: string, password: string) => {
  let user = await User.findOne({ email });

  if (!user) {
    const error = {
      status: 400,
      message: 'These credentials are invalid.',
    };
    throw error;
  }
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const error = {
      status: 400,
      message: 'These credentials are invalid.',
    };
    throw error;
  }

  if (!user.refreshToken) {
    user = await createSessionToken(user);
  }

  const token = signJWT({ _id: user._id }, 'User');

  return {
    authToken: token,
    refreshToken: user.refreshToken,
  };
};

export const updatePassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(id);
  if (!user)
    throw {
      status: 400,
      message: 'The user id is not valid',
    };

  const validPassword = await bcrypt.compare(oldPassword, user.password);
  if (!validPassword)
    throw {
      status: 400,
      message: 'The old password is not valid',
    };

  user.password = await bcrypt.hash(newPassword, 12);
  return user.save();
};

const createSessionToken = async (user: IUser) => {
  const refreshToken = await generateToken(64);
  user.refreshToken = refreshToken;
  return user.save();
};
