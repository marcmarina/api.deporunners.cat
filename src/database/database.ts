import mongoose from 'mongoose';
import { logger } from '../logger';

const connect = async (connectionString: string) => {
  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  logger.info('Database connected');
};

const disconnect = async () => {
  await mongoose.connection.close();
  logger.info('Database disconnected');
};

export const database = {
  connect,
  disconnect,
};
