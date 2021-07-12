import jwt from 'jsonwebtoken';
import { IMember } from '../models/Member';
import { IUser } from '../models/User';
import { MemberService } from '../services/member-service';
import { findUserById } from '../services/user';
import config from '../config/config';

type ModelName = 'User' | 'Member';

const memberService = new MemberService();

export const generateNewJWT = async (
  id: string,
  refreshToken: string,
  modelName: ModelName
): Promise<string> => {
  const model: IMember | IUser =
    modelName === 'Member'
      ? await memberService.findById(id)
      : await findUserById(id);

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
    config.appSecretKey(),
    {
      expiresIn: parseInt(config.jwtExpiration()),
    }
  );
};
