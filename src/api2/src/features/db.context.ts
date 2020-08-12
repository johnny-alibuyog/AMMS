import { IModelOptions, ReturnModelType } from '@typegoose/typegoose/lib/types';
import { User, userModelOptions } from './membership/users/user.models';
import { getModelForClass, mongoose } from '@typegoose/typegoose';

import { Branch } from './membership/branches/branch.models';
import { ConnectionOptions } from 'mongoose';
import { Image } from './common/images/image.models';
import { Resource } from './membership/resources/resource.model';
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
  resources: ReturnModelType<typeof Resource, unknown>,
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
      mongoose.set('debug', true);
    }
    /// REF: https://stackoverflow.com/questions/37377310/how-to-enable-auditing-and-log-all-crud-operations-in-mongodb-node-app
    // mongoose.set('debug', (coll: unknown, method: unknown, query: unknown, doc: unknown, options?: unknown) => {
    //   //do your thing
    //   console.log(coll);
    //   console.log(method);
    //   console.log(query);
    //   console.log(doc);
    //   console.log(options);
    //  });
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
    resources: getModelForClass(Resource, defaultModelOption),
    roles: getModelForClass(Role, defaultModelOption),
    users: getModelForClass(User, userModelOptions),
  };
  
  await seedData(dbContext);
  return dbContext;
}

