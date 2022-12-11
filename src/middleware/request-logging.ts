import { logger } from '../logger';
import { NextFunction, Request, Response } from 'express';

const blacklistedRoutes = ['/health'];

export const requestLogging = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (!blacklistedRoutes.includes(req.path)) {
    logger.request({
      ip: req.ip,
      url: req.originalUrl,
    });
  }

  next();
};
