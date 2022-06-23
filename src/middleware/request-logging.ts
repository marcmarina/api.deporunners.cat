import logger from '../utils/logger';
import Context from '../utils/Context';
import { NextFunction, Request, Response } from 'express';

export default (req: Request, _res: Response, next: NextFunction) => {
  logger.request({
    user: Context.getUserId(),
    ip: req.ip,
    url: req.originalUrl,
  });

  next();
};
