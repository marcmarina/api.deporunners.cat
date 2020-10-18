import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Member from '../models/Member';
import User from '../models/User';

export const generateNewJWT = async (
  id: string,
  refreshToken: string
): Promise<string> => {
  try {
    let model: mongoose.Document;

    model = await Member.findById(id);

    if (!model) model = await User.findById(id);

    if (model['refreshToken'] === refreshToken) {
      return jwt.sign(
        {
          ...model.toObject(),
        },
        process.env.APP_SECRET_KEY,
        {
          expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME),
        }
      );
    } else {
      throw {
        status: 401,
        message: 'Refresh token not valid',
      };
    }
  } catch (ex) {
    throw ex;
  }
};
