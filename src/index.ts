import app, { apolloServer } from './app';
import config from './config/config';

const PORT = config.port();

app.listen(PORT, () => {
  console.debug(`🚀 App listening on http://localhost:${PORT}
  `);
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
});
