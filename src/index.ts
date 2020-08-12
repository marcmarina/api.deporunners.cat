import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res, next) => {
  const response = require('../package.json');
  delete response['repository'];
  res.status(200).json(response);
});

// mongoose
//   .connect(getMongoDBUri(), {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(result => {
//     app.listen(getPort() || 8080);
//   })
//   .catch(err => console.log(err));

app.listen(process.env.PORT || 8080);
