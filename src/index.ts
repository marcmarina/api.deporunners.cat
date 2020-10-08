import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import UserRoutes from './routes/user';
import RoleRoutes from './routes/role';
import MemberRoutes from './routes/member';
import TownRoutes from './routes/town';
import TShirtSizeRoutes from './routes/tshirtSize';
import EventRoutes from './routes/event';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  try {
    const apiToken = req.get('api-token');
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

app.get('/', (req, res, next) => {
  const response = require('../package.json');
  delete response['repository'];
  res.status(200).json(response);
});

app.use('/user', UserRoutes);
app.use('/role', RoleRoutes);
app.use('/member', MemberRoutes);
app.use('/town', TownRoutes);
app.use('/tshirtsize', TShirtSizeRoutes);
app.use('/event', EventRoutes);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const result = {
    status: status,
    errors: error.errors || [{ msg: error.message }],
  };
  res.status(status).json(result);
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(result => {
    app.listen(process.env.PORT || 8080);
  })
  .catch(err => console.log(err));
