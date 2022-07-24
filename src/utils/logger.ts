import * as Sentry from '@sentry/node';
import pino from 'pino';

import { envIsDev, envIsTest } from '../config/config';

function getLogLevel() {
  if (envIsDev) {
    return 'trace';
  } else if (envIsTest) {
    return 'silent';
  } else {
    return 'info';
  }
}

const logger = pino({
  ...(envIsDev && { transport: { target: 'pino-pretty' } }),
  level: getLogLevel(),
});

export default {
  error: (error: Error) => {
    logger.error(error);

    if (!envIsDev || !envIsTest) {
      Sentry.captureException(error);
    }
  },
  debug: (msg: string, args?: Record<string, unknown>) => {
    logger.debug({ ...args }, msg);
  },
  info: (msg: string, args?: Record<string, unknown>) => {
    logger.info({ ...args }, msg);
  },
  request: (args?: Record<string, unknown>) => {
    logger.info({ ...args });
  },
};
