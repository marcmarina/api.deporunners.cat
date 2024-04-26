import { createLogger } from './create-logger';

const pinoLogger = createLogger();

class Logger {
  error(error: Error) {
    pinoLogger.error(error);
  }

  debug(msg: string, args?: Record<string, unknown>) {
    pinoLogger.debug({ ...args }, msg);
  }

  info(msg: string, args?: Record<string, unknown>) {
    pinoLogger.info({ ...args }, msg);
  }
}

export const logger = new Logger();
