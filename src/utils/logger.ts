import * as Sentry from '@sentry/node';
import pino from 'pino';

import { isDev, isTest } from '../config/config';

function getLogLevel() {
  if (isDev()) {
    return 'trace';
  } else if (isTest()) {
    return 'silent';
  } else {
    return 'info';
  }
}

const logger = pino({
  ...(isDev() ? { transport: { target: 'pino-pretty' } } : {}),
  level: getLogLevel(),
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
  info: (msg: string) => {
    logger.info(msg);
  },
};
