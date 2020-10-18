import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Member, { IMember } from '../models/Member';
import User, { IUser } from '../models/User';

export const generateNewJWT = async (
  id: string,
  refreshToken: string,
  modelName: string
): Promise<string> => {
  try {
    let model: IMember | IUser;

    if (modelName === 'Member') {
      model = await Member.findById(id);
    } else if (modelName === 'User') {
      model = await User.findById(id);
    }

    if (model.refreshToken === refreshToken) {
      return jwt.sign(
        {
          _id: model._id,
          model: modelName,
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
