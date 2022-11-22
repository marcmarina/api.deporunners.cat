import mongoose from 'mongoose';
import logger from '../utils/logger';

const connect = async (connectionString: string) => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    logger.info('Database connected');
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
