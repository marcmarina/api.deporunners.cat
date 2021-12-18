import app from './app';
import config from './config/config';
import db from './config/db';
import logger from './utils/logger';

const server = app.listen(config.port(), async () => {
  await db.connect(config.mongoURI());

  logger.debug(`🚀 App listening on http://localhost:${config.port()}`);
});

process.on('SIGTERM', async () => {
  logger.info('Tearing down application');

  server.close(async (err) => {
    if (err) logger.error(err);

    await db.disconnect();

    logger.info('Teardown complete');

    process.exit(0);
  });
});
