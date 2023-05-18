import { NextFunction, Request, Response } from 'express';

import { generateSession } from '@deporunners/auth';

export const getSession = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authToken = req.get('x-auth-token') ?? null;
    const refreshToken = req.get('x-refresh-token') ?? null;

    const session = await generateSession(authToken, refreshToken);

    res.locals.user = session.user;

    res.set({
      'x-auth-token': session.authToken,
      'x-refresh-token': session.refreshToken,
    });

    next();
  } catch (ex) {
    next(ex);
  }
};
