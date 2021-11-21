import app from './app';
import config from './config/config';
import db from './config/db';

const server = app.listen(config.port(), async () => {
  await db.connect(config.mongoURI());

  console.log(`🚀 App listening on http://localhost:${config.port()}`);
});

process.on('SIGINT', async () => {
  server.close();
  await db.disconnect();

  process.exit(0);
});
