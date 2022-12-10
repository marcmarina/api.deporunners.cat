import { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { config } from '../config';

export const apiToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenResult = validateToken(req.headers);
    if (tokenResult) {
      res.status(tokenResult.status).send(tokenResult.msg);
    } else {
      return next();
    }
  } catch (ex) {
    next(ex);
  }
};

export const validateToken = (headers: IncomingHttpHeaders) => {
  const apiToken = headers['x-api-token'];
  if (!apiToken) {
    return {
      status: 401,
      msg: 'No API Token provided',
    };
  } else if (apiToken !== config.apiToken) {
    return {
      status: 401,
      msg: 'API Token is not valid',
    };
  } else {
    return undefined;
  }
};
