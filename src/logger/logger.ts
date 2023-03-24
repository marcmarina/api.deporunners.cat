import * as Sentry from '@sentry/node';

import { envIsDev, envIsTest } from '../config';

import { createLogger } from './create-logger';

const pinoLogger = createLogger();

class Logger {
  /**
   * Log an error. If the environment is development or testing it only logs it to the console. Otherwise it also logs it to Sentry.
   *
   * This behaviour can be overridden with the `logToSentry` argument.
   *
   * @param {Error} error - Error to log.
   * @param {boolean} [logToSentry] - Flag to bypass environment and force logging to Sentry.
   */
  error(error: Error, logToSentry?: boolean) {
    pinoLogger.error(error);

    if (logToSentry || (!envIsDev() && !envIsTest())) {
      Sentry.captureException(error);
    }
  }

  debug(msg: string, args?: Record<string, unknown>) {
    pinoLogger.debug({ ...args }, msg);
  }

  info(msg: string, args?: Record<string, unknown>) {
    pinoLogger.info({ ...args }, msg);
  }
}

export const logger = new Logger();
