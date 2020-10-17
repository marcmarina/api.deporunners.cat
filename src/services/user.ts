import bcrypt from 'bcrypt';
import { create } from 'domain';
import jwt from 'jsonwebtoken';

import User, { IUser } from '../models/User';
import { generateToken } from '../utils/Utils';

export const getAllUsers = async (): Promise<IUser[]> => {
  return await User.find();
};

export const createUser = async (user: IUser): Promise<IUser> => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;

    return await user.save();
  } catch (ex) {
    console.log(ex);
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
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

    const token = jwt.sign(
      {
        ...user.toObject(),
      },
      process.env.APP_SECRET_KEY,
      {
        expiresIn: 900,
      }
    );

    return {
      authToken: token,
      refreshToken: user.refreshToken,
    };
  } catch (ex) {
    throw ex;
  }
};

export const updatePassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
) => {
  try {
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
    return await user.save();
  } catch (ex) {
    throw ex;
  }
};

const createSessionToken = async (user: IUser) => {
  try {
    const refreshToken = await generateToken(64);
    user.refreshToken = refreshToken;
    return await user.save();
  } catch (ex) {
    throw ex;
  }
};
