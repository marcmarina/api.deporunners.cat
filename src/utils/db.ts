import mongoose from 'mongoose';
import logger from './logger';

const connect = async (connectionString: string) => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (ex) {
    logger.error(ex);
  }
};

const disconnect = async () => {
  try {
    await mongoose.connection.close();
  } catch (ex) {
    logger.error(ex);
  }
};

export default {
  connect,
  disconnect,
};
