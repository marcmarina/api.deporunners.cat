import bcrypt from 'bcrypt';

import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';

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
): Promise<String> => {
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
        email: user.email,
        name: user.name,
      },
      process.env.APP_SECRET_KEY
    );

    return token;
  } catch (ex) {
    throw ex;
  }
};
