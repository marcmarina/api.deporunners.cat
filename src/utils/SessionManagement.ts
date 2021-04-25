import jwt from 'jsonwebtoken';
import Member, { IMember } from '../models/Member';
import User, { IUser } from '../models/User';
import environment from './environment';

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
      msg: 'Model id not valid',
    };
  }

  if (refreshToken && model.refreshToken === refreshToken) {
    return signJWT({ _id: model._id }, modelName);
  } else {
    throw {
      status: 401,
      msg: 'Refresh token not valid',
    };
  }
};

export const signJWT = (data: any, modelName: ModelName) => {
  return jwt.sign(
    {
      ...data,
      model: modelName,
    },
    environment.appSecretKey(),
    {
      expiresIn: parseInt(environment.jwtExpiration()),
    }
  );
};
