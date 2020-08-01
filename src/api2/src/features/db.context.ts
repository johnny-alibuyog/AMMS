import { IModelOptions, ReturnModelType } from '@typegoose/typegoose/lib/types';
import { User, userModelOptions } from './membership/users/user.models';
import { getModelForClass, mongoose } from '@typegoose/typegoose';

import { Branch } from './membership/branches/branch.models';
import { ConnectionOptions } from 'mongoose';
import { Image } from './common/images/image.models';
import { Role } from './membership/roles/role.models';
import { config } from '../config';
import { seedData } from './db.seeder';

type Args = {
  successFn?: Function,
  errorFn?: (error: Error) => void
};

export type DbContext = {
  images: ReturnModelType<typeof Image, unknown>, 
  branches: ReturnModelType<typeof Branch, unknown>,
  roles: ReturnModelType<typeof Role, unknown>,
  users: ReturnModelType<typeof User, unknown>,
}

let dbContext: DbContext;

const defaultModelOption: IModelOptions = {
  schemaOptions: {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret, options) => {
        // ret['id'] = ret['_id'];
        // delete ret['_id'];
        return ret;
      }
    }
  }
};

const initConnection = ({ successFn, errorFn }: Args = {}) => {
  const options: ConnectionOptions = {
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    dbName: config.db.name,
  };

  return new Promise((resolve, reject) => {
    mongoose.connect(config.db.host, options);
    mongoose.connection.on('open', () => {
      if (successFn) {
        successFn();
      }
      resolve();
    });
    mongoose.connection.on('error', (error) => {
      if (errorFn) {
        errorFn(error);
      }
      reject(error);
    });
    if (config.environment !== 'production') {
      // mongoose.set('debug', true);
    }
  });
}

export const initDbContext = async ({ successFn, errorFn }: Args = {}) => {
  if (dbContext) {
    return dbContext;
  }
  await initConnection({ successFn, errorFn });
  dbContext = {
    images: getModelForClass(Image, defaultModelOption),
    branches: getModelForClass(Branch, defaultModelOption),
    roles: getModelForClass(Role, defaultModelOption),
    users: getModelForClass(User, userModelOptions),
  };
  await seedData(dbContext);
  return dbContext;
}

