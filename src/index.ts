import app from './app';
import config from './config/config';
import db from './config/db';
import logger from './utils/logger';

const server = app.listen(config.port(), async () => {
  await db.connect(config.mongoURI());

  logger.debug(`🚀 App listening on http://localhost:${config.port()}`);
});

process.on('SIGINT', async () => {
  server.close(async (err) => {
    if (err) logger.error(err);

    await db.disconnect();

    process.exit(0);
  });
});
