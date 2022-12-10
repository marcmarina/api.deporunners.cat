import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Member, User } from '../models';

export const generateSession = async (token, refreshToken) => {
  const verifiedToken = decodeAndVerifyToken(token);

  if (verifiedToken) {
    return {
      token,
      user: verifiedToken,
    };
  }

  const { user, newToken } = await generateNewSession(refreshToken);

  return { user, token: newToken };
};

const decodeAndVerifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.appSecretKey);
  } catch (ex) {
    return null;
  }
};

const generateNewSession = async (refreshToken: string) => {
  const results = await Promise.all([
    User.findOne({ refreshToken }),
    Member.findOne({ refreshToken }),
  ]);

  const model = results.find((result) => result);

  if (model) {
    return {
      user: model,
      newToken: jwt.sign({ ...model }, config.appSecretKey),
    };
  } else {
    return {
      user: null,
      newToken: null,
    };
  }
};
