import pino from 'pino';

import { config } from '@deporunners/config';

export function createLogger() {
  return pino({
    ...(config.logger.format === 'pretty' && {
      transport: {
        target: 'pino-pretty',
      },
    }),
    level: config.logger.level,
  });
}
