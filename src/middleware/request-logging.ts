import logger from '../utils/logger';
import Context from '../utils/Context';
import { NextFunction, Request, Response } from 'express';

const blacklistedRoutes = ['/health'];

export const requestLogging = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!blacklistedRoutes.includes(req.path)) {
    logger.request({
      user: Context.getUserId(),
      ip: req.ip,
      url: req.originalUrl,
    });
  }

  next();
};
