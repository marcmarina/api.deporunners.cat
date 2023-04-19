import { envIsDev, envIsTest } from '@deporunners/config';
import pino from 'pino';

function getLogLevel() {
  if (envIsDev()) {
    return 'trace';
  } else if (envIsTest()) {
    return 'silent';
  } else {
    return 'info';
  }
}

export function createLogger() {
  return pino({
    ...(envIsDev() && { transport: { target: 'pino-pretty' } }),
    level: getLogLevel(),
  });
}
