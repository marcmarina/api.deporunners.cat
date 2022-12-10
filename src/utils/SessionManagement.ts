import jwt from 'jsonwebtoken';
import { IUser, IMember } from '../models';
import { MemberService, userService } from '../services';
import { config } from '../config';

type ModelName = 'User' | 'Member';

const memberService = new MemberService();

export const generateNewJWT = async (
  id: string,
  refreshToken: string,
  modelName: ModelName,
): Promise<string> => {
  const model: IMember | IUser | null =
    modelName === 'Member'
      ? await memberService.findById(id)
      : await userService.findUserById(id);

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
    config.appSecretKey,
    {
      expiresIn: parseInt(config.jwtExpiration),
    },
  );
};
