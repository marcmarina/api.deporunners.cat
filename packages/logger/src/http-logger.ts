import crypto from 'crypto';

import pinoHttp from 'pino-http';

import { createLogger } from './create-logger';

const blacklistedRoutes = ['/health'];

export const httpLogger = pinoHttp({
  logger: createLogger(),
  autoLogging: {
    ignore: (req) => blacklistedRoutes.includes(req.url ?? ''),
  },
  redact: {
    paths: [
      'req.headers["x-api-token"]',
      'res.headers["x-api-token"]',
      'req.headers["x-auth-token"]',
      'res.headers["x-auth-token"]',
      'req.headers["x-refresh-token"]',
      'res.headers["x-refresh-token"]',
      'req.headers.authorization',
      'res.headers.authorization',
    ],
    remove: true,
  },
  genReqId: (req, res) => {
    if (req.id) {
      return req.id as string;
    } else if (req.headers['x-request-id']) {
      return req.headers['x-request-id'] as string;
    } else {
      const id = crypto.randomUUID();

      res.setHeader('x-request-id', id);

      return id;
    }
  },
});
