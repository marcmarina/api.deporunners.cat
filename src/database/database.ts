import { logger } from '@deporunners/logger';
import mongoose from 'mongoose';

const connect = async (connectionString: string) => {
  logger.info('Attempting to connect to database');
  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  logger.info('Database connected');
};

const disconnect = async () => {
  logger.info('Attempting to disconnect from database');
  await mongoose.connection.close();
  logger.info('Database disconnected');
};

export const database = {
  connect,
  disconnect,
};
