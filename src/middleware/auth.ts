import jwt from 'jsonwebtoken';
import { generateNewJWT } from '../utils/SessionManagement';

export default async (req, res, next) => {
  try {
    const token = req.get('x-auth-token');
    const refreshToken = req.get('x-refresh-token');
    if (!refreshToken || !token) {
      throw {
        status: 401,
        message: 'Not authenticated',
      };
    }

    const decodedToken = jwt.decode(token);
    try {
      jwt.verify(token, process.env.APP_SECRET_KEY);
      res.set({ 'x-auth-token': token });
    } catch (ex) {
      if (ex.name === 'TokenExpiredError') {
        try {
          const newToken = await generateNewJWT(
            decodedToken['_id'],
            refreshToken,
            decodedToken['model']
          );
          res.set({
            'x-auth-token': newToken,
          });
        } catch (ex) {
          throw ex;
        }
      } else {
        throw {
          ...ex,
          status: 401,
        };
      }
    }

    req.userId = decodedToken['_id'];

    next();
  } catch (ex) {
    next(ex);
  }
};
