import { IMember, IUser } from '../models';
import { MemberService, userService } from '../services';
import { signJWT } from './jwt-signing';

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
    return signJWT({ _id: model._id, modelName });
  } else {
    throw {
      status: 401,
      msg: 'Refresh token not valid',
    };
  }
};
