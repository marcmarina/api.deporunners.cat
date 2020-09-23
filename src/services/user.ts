import bcrypt from 'bcrypt';

import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

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

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const user = await User.findOne({ email });

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
    const token = jwt.sign(
      {
        ...user.toObject(),
      },
      process.env.APP_SECRET_KEY
    );

    return token;
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
