import bcrypt from 'bcrypt';
import { Schema } from 'mongoose';

import User, { IUser } from '../models/User';
import { signJWT } from '../utils/SessionManagement';
import { generateToken } from '../utils/Utils';

export const getAllUsers = async (): Promise<IUser[]> => {
  try {
    return await User.find();
  } catch (ex) {
    throw ex;
  }
};

export const findUserById = async (id: Schema.Types.ObjectId) => {
  try {
    return await User.findById(id);
  } catch (ex) {
    throw ex;
  }
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

    const token = signJWT({ _id: user._id }, 'User');

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
