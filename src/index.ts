import app from './app';
import config from './config/config';

app.listen(config.port(), () => {
  console.debug(`🚀 App listening on http://localhost:${config.port()}`);
});
