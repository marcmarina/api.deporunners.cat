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

    const session = await generateSession(authToken, refreshToken);

    res.locals.user = session.user;
    res.set({ 'x-auth-token': session.authToken });
    res.set({ 'x-refresh-token': session.refreshToken });

    next();
  } catch (ex) {
    next(ex);
  }
};
