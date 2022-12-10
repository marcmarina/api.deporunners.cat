import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Member, User } from '../models';
import { signJWT } from './jwt-signing';

export const generateSession = async (token, refreshToken) => {
  if (!token && !refreshToken) {
    return {
      token: null,
      user: null,
    };
  }

  const verifiedToken = decodeAndVerifyToken(token);
  if (verifiedToken) {
    return {
      token,
      user: verifiedToken,
    };
  }

  const refreshTokenOwner = await getEntityFromRefreshToken(refreshToken);
  if (refreshTokenOwner) {
    return {
      token: signJWT(refreshTokenOwner),
      user: refreshTokenOwner,
    };
  }

  return {
    token: null,
    user: null,
  };
};

const decodeAndVerifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.appSecretKey);
  } catch (ex) {
    return null;
  }
};

const getEntityFromRefreshToken = async (refreshToken: string) => {
  const results = await Promise.all([
    User.findOne({ refreshToken }),
    Member.findOne({ refreshToken }),
  ]);

  const model = results.find((result) => result);

  return model;
};
