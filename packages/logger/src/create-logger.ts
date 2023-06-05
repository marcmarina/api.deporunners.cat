import pino from 'pino';

import { config, Environment } from '@deporunners/config';
import { assertNever } from '@deporunners/utils';

function getLogLevel(): pino.LevelWithSilent {
  switch (config.environment) {
    case Environment.Test:
      return 'silent';
    case Environment.Dev:
      return 'trace';
    case Environment.Staging:
    case Environment.Production:
      return 'info';
    default:
      assertNever(config.environment);
  }
}

export function createLogger() {
  return pino({
    ...(config.environment === Environment.Dev && {
      transport: { target: 'pino-pretty' },
    }),
    level: getLogLevel(),
  });
}
