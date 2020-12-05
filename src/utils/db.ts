import mongoose from 'mongoose';

const connect = async (connectionString: string) => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (ex) {
    console.log(ex);
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
  } catch (ex) {
    console.log(ex);
  }
};

export default {
  connect,
  disconnect,
};
