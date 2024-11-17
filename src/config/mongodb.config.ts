import { registerAs } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export default registerAs('mongodb', () => {
  const options: MongooseModuleFactoryOptions = {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DATABASE,
    minPoolSize: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) | 10,
    maxPoolSize: parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10) | 20,
    maxIdleTimeMS: parseInt(process.env.DATABASE_IDLE_TIMEOUT, 10) | 60000,
  };

  return options;
});
