import jwt from 'jsonwebtoken';
import { generateNewJWT } from '../utils/jwt-generation';
import { context } from '../utils';
import { config } from '../config';
import * as z from 'zod';

export const auth = async (req, res, next) => {
  try {
    const { token, refreshToken } = getTokens(req);
    const decodedToken = decodedTokenSchema.parse(jwt.decode(token));

    try {
      jwt.verify(token, config.appSecretKey);

      res.set({ 'x-auth-token': token });
    } catch (ex) {
      if (ex.name === 'TokenExpiredError') {
        const newToken = await generateNewJWT(
          decodedToken._id,
          refreshToken,
          decodedToken.model,
        );

        res.set({
          'x-auth-token': newToken,
        });
      } else {
        throw {
          ...ex,
          status: 401,
        };
      }
    }

    context.setUserId(decodedToken._id);

    next();
  } catch (ex) {
    next(ex);
  }
};

export const getTokens = (req) => {
  const token = req.headers['x-auth-token'];
  const refreshToken = req.headers['x-refresh-token'];

  if (!refreshToken || !token) {
    throw {
      status: 401,
      msg: 'Not authenticated',
    };
  }
  return {
    token,
    refreshToken,
  };
};

const decodedTokenSchema = z.object({
  _id: z.string(),
  model: z.enum(['Member', 'User']),
});
