import app from './app';
import config from './config/config';
import db from './utils/db';

const server = app.listen(config.port(), () => {
  console.debug(`🚀 App listening on http://localhost:${config.port()}`);
});

process.on('SIGTERM', () => {
  server.close();
  db.disconnect();
  process.exit(0);
});
