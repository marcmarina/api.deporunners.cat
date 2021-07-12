import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import httpContext from 'express-http-context';

import UserRoutes from './routes/user';
import RoleRoutes from './routes/role';
import MemberRoutes from './routes/member';
import TownRoutes from './routes/town';
import TShirtSizeRoutes from './routes/tshirtSize';
import EventRoutes from './routes/event';
import StripeWebhooks from './routes/stripeWebhooks';

import apiToken from './middleware/apiToken';
import db from './utils/db';
import env from './config/config';

const app = express();

app.use(express.json());
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
  })
);

app.get('/', (req, res) => {
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

app.use('/', (req, res, _next) => {
  res.status(404).send('Not Found');
});

app.use((error, req, res, _next) => {
  const status = error['status'] || 500;
  res.status(status).json(error);
});

db.connect(env.mongoURI());

export default app;
