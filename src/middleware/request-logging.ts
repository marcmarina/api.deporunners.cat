import logger from '../utils/logger';
import Context from '../utils/Context';
import { Request } from 'express';

export default (req: Request, _res, next) => {
  logger.request({
    user: Context.getUserId(),
    ip: req.ip,
    url: req.originalUrl,
  });

  next();
};
