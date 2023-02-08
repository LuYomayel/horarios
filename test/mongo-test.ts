import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export const rootMongooseTestModule = (options: MongooseModuleOptions = {}) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      mongod = new MongoMemoryServer();
      return {
        uri: 'mongodb+srv://user_1:02320434321l@cluster0.104hh.mongodb.net/test',
        ...options,
      };
    },
  });

export const closeInMongodConnection = async () => {
  if (mongod) await mongod.stop();
};
