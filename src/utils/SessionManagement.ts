import jwt from 'jsonwebtoken';
import Member, { IMember } from '../models/Member';
import User, { IUser } from '../models/User';

type ModelName = 'User' | 'Member';

export const generateNewJWT = async (
  id: string,
  refreshToken: string,
  modelName: ModelName
): Promise<string> => {
  let model: IMember | IUser;

  if (modelName === 'Member') {
    model = await Member.findById(id);
  } else if (modelName === 'User') {
    model = await User.findById(id);
  }

  if (!model) {
    throw {
      status: 401,
      message: 'Model id invalid',
    };
  }

  if (model.refreshToken === refreshToken) {
    return signJWT({ _id: model._id }, modelName);
  } else {
    throw {
      status: 401,
      message: 'Refresh token not valid',
    };
  }
};

export const signJWT = (data: any, modelName: ModelName) => {
  return jwt.sign(
    {
      ...data,
      model: modelName,
    },
    process.env.APP_SECRET_KEY,
    {
      expiresIn: parseInt(process.env.JWT_EXPIRATION_TIME),
    }
  );
};
