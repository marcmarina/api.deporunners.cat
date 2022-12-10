import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import cors from 'cors';
import httpContext from 'express-http-context';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import {
  UserRoutes,
  RoleRoutes,
  MemberRoutes,
  TownRoutes,
  TShirtSizeRoutes,
  EventRoutes,
  StripeWebhooks,
  DevRoutes,
} from './routes';

import { config, envIsDev } from './config';
import { AuthError, BaseError, InputError } from './errors';
import { logger } from './logger';
import { apiToken, requestLogging } from './middleware';

const app = express();

Sentry.init({
  dsn: config.sentryDSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
  environment: config.environment,
});

app.use(requestLogging);

if (envIsDev) {
  app.use('/dev', DevRoutes);
}

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

app.use(express.static('public'));

app.use(Sentry.Handlers.requestHandler() as RequestHandler);
app.use(Sentry.Handlers.tracingHandler() as RequestHandler);

app.use(express.json() as RequestHandler);
app.use(httpContext.middleware);
app.use(
  cors({
    allowedHeaders: [
      'Content-Type',
      'x-auth-token',
      'x-refresh-token',
      'x-api-token',
    ],
    exposedHeaders: ['x-auth-token', 'x-refresh-token'],
  }),
);

app.get('/favicon.ico', (_req, res) => res.status(204).end());

app.get('/', (_req: Request, res) => {
  const response = require('../package.json');
  delete response['repository'];
  return res.status(200).json(response);
});

app.use('/stripe', StripeWebhooks);

app.use(apiToken);

app.use('/user', UserRoutes);
app.use('/role', RoleRoutes);
app.use('/member', MemberRoutes);
app.use('/town', TownRoutes);
app.use('/tshirtsize', TShirtSizeRoutes);
app.use('/event', EventRoutes);

app.use('/', (_req: Request, res: Response, _next) => {
  res.status(404).send('Not Found');
});

app.use(
  (error: BaseError, _req: Request, res: Response, _next: NextFunction) => {
    if (!(error instanceof InputError || error instanceof AuthError)) {
      logger.error(error);
    }

    res.status(error.status).json({ ...error, message: error.message });
  },
);

export default app;
