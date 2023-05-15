import pino from 'pino';

import { envIsDev, envIsTest } from '@deporunners/config';

function getLogLevel(): pino.LevelWithSilent {
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
