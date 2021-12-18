import * as Sentry from '@sentry/node';
import pino from 'pino';

import { isDev } from '../config/config';

const logger = pino({
  ...(isDev() ? { transport: { target: 'pino-pretty' } } : {}),
  level: isDev() ? 'trace' : 'info',
});

export default {
  error: (error: Error) => {
    logger.error(error);

    if (!isDev()) {
      Sentry.captureException(error);
    }
  },
  debug: (msg: string) => {
    logger.debug(msg);
  },
};
