import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import 'dotenv/config';

import UserRoutes from './routes/user';
import RoleRoutes from './routes/role';
import MemberRoutes from './routes/member';
import TownRoutes from './routes/town';
import TShirtSizeRoutes from './routes/tshirtSize';
import EventRoutes from './routes/event';

const app = express();

app.use(bodyParser.json());
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

app.use((req, res, next) => {
  try {
    const apiToken = req.get('x-api-token');
    if (!apiToken) {
      throw {
        status: 401,
        message: 'No API Token provided',
      };
    } else if (apiToken !== process.env.API_TOKEN) {
      throw {
        status: 401,
        message: 'API Token is not valid',
      };
    }
    next();
  } catch (ex) {
    next(ex);
  }
});

app.use('/user', UserRoutes);
app.use('/role', RoleRoutes);
app.use('/member', MemberRoutes);
app.use('/town', TownRoutes);
app.use('/tshirtsize', TShirtSizeRoutes);
app.use('/event', EventRoutes);

app.use('/', (req, res, next) => {
  res.status(404).send('Not Found');
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error['status'] || 500;
  res.status(status).json(error);
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch(err => console.log(err));

export default app;
