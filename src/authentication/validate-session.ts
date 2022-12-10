import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Member, User } from '../models';
import { signJWT } from './jwt-signing';

type Session = {
  authToken: string | null;
  refreshToken: string | null;
  user: any;
};

export const generateSession = async (
  authToken,
  refreshToken,
): Promise<Session> => {
  if (!authToken || !refreshToken) {
    return {
      authToken: null,
      refreshToken: null,
      user: null,
    };
  }

  const verifiedToken = decodeAndVerifyToken(authToken);
  if (verifiedToken) {
    return {
      authToken,
      refreshToken,
      user: verifiedToken,
    };
  }

  const refreshTokenOwner = await getEntityFromRefreshToken(refreshToken);
  if (refreshTokenOwner) {
    return {
      authToken: signJWT(refreshTokenOwner),
      refreshToken: refreshToken,
      user: refreshTokenOwner,
    };
  }

  return {
    authToken: null,
    refreshToken: null,
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
