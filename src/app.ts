import express from 'express';
import cors from 'cors';
import favicon from 'serve-favicon';
import path from 'path';
import 'dotenv/config';
import multer from 'multer';
import httpContext from 'express-http-context';

import UserRoutes from './routes/user';
import RoleRoutes from './routes/role';
import MemberRoutes from './routes/member';
import TownRoutes from './routes/town';
import TShirtSizeRoutes from './routes/tshirtSize';
import EventRoutes from './routes/event';
import ClothingRoutes from './routes/clothing';

import apiToken from './middleware/apiToken';
import db from './utils/db';
import env from './utils/environment';

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, '-').replace(/ /g, '-')}-${
        file.originalname
      }`
    );
  },
});

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

app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));

app.get('/', (req, res) => {
  const response = require('../package.json');
  delete response['repository'];
  return res.status(200).json(response);
});

app.use(multer({ storage: fileStorage }).single('image'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(apiToken);

app.use('/user', UserRoutes);
app.use('/role', RoleRoutes);
app.use('/member', MemberRoutes);
app.use('/town', TownRoutes);
app.use('/tshirtsize', TShirtSizeRoutes);
app.use('/event', EventRoutes);
app.use('/clothing', ClothingRoutes);

app.use('/', (req, res, next) => {
  res.status(404).send('Not Found');
});

app.use((error, req, res, next) => {
  console.log(error);
  const status = error['status'] || 500;
  res.status(status).json(error);
});

db.connect(env.mongoURI());

export default app;
