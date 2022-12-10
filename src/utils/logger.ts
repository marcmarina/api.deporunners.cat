import * as Sentry from '@sentry/node';
import pino from 'pino';

import { envIsDev, envIsTest } from '../config';

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
  /**
   * Log an error. If the environment is development or testing it only logs it to the console. Otherwise it also logs it to Sentry.
   *
   * This behaviour can be overridden with the `logToSentry` argument.
   *
   * @param {Error} error - Error to log.
   * @param {boolean} [logToSentry] - Flag to bypass environment and force logging to Sentry.
   */
  error: (error: Error, logToSentry?: boolean) => {
    logger.error(error);

    if (logToSentry || !envIsDev || !envIsTest) {
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
