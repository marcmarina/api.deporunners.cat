import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import cors from 'cors';
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';

import { config } from '@deporunners/config';
import { AuthError, BaseError, InputError } from '@deporunners/errors';
import { httpLogger, logger } from '@deporunners/logger';

import { apiToken, getSession } from './middleware';
import {
  EventRoutes,
  MemberRoutes,
  RoleRoutes,
  StripeWebhooks,
  TownRoutes,
  TShirtSizeRoutes,
  UserRoutes,
} from './routes';

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

app.use(httpLogger);

app.get('/health', (_req, res) => {
  res.status(200).send('OK');
});

app.use(express.static('public'));

app.use(Sentry.Handlers.requestHandler() as RequestHandler);
app.use(Sentry.Handlers.tracingHandler() as RequestHandler);

app.use(express.json() as RequestHandler);
app.use(
  cors({
    allowedHeaders: [
      'Content-Type',
      'x-auth-token',
      'x-refresh-token',
      'x-api-token',
      'x-request-id',
    ],
    exposedHeaders: ['x-auth-token', 'x-refresh-token'],
  }),
);

app.get('/favicon.ico', (_req, res) => res.status(204).end());

app.get('/', (_req: Request, res) => {
  const response = require('../package.json');
  return res.status(200).json(response);
});

app.use('/stripe', StripeWebhooks);

app.use(apiToken);
app.use(getSession);

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

    res.status(error.status ?? 500).json({ ...error, message: error.message });
  },
);

export default app;
