import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import UserRoutes from './routes/user';
import RoleRoutes from './routes/role';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res, next) => {
  const response = require('../package.json');
  delete response['repository'];
  res.status(200).json(response);
});

app.use('/user', UserRoutes);
app.use('/role', RoleRoutes);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const result = {
    status: status,
    errors: error.errors,
  };
  res.status(status).json(result);
});

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(result => {
    app.listen(process.env.PORT || 8080);
  })
  .catch(err => console.log(err));
