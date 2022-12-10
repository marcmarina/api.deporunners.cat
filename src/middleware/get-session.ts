import { NextFunction, Request, Response } from 'express';
import { generateSession } from '../authentication';

export const getSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authToken = req.headers['x-auth-token'] as string;
    const refreshToken = req.headers['x-refresh-token'] as string;

    const { token, user } = await generateSession(authToken, refreshToken);

    res.locals.user = user;
    res.set({ 'x-auth-token': token });

    next();
  } catch (ex) {
    next(ex);
  }
};
