import { logger } from './../utils/logger';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { ConnectionOptions } from 'mongoose';
import { config } from '../config';
import { Role, Resource, AccessControl, Permission, Action, Ownership } from './membership/roles/role.models';
import { User, userModelOptions, Person, Gender } from './membership/users/user.models';
import { IModelOptions, ReturnModelType } from '@typegoose/typegoose/lib/types';

type Args = {
  successFn?: Function,
  errorFn?: (error: Error) => void
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

const initializeData = async (db: DbContext): Promise<void> => {
  if (config.environment === 'test') {
    await Promise.all([
      db.users.deleteMany({}),
      db.roles.deleteMany({})
    ]);
  }
};

const ensureSuperUser = async (db: DbContext): Promise<User> => {
  let superUser = await db.users.findOne({ username: config.tenant.superUser.username });
  if (!superUser) {
    let superRole = await db.roles.findOne({
      name: `${config.tenant.superRole.name} SUPER ROLE`
    });
    if (!superRole) {
      superRole = await db.roles.create(new Role({
        name: config.tenant.superRole.name,
        accessControls: [
          new AccessControl({
            resource: Resource.all,
            permissions: [
              new Permission({ action: Action.all, ownership: Ownership.any }),
              new Permission({ action: Action.read, ownership: Ownership.any }),
              new Permission({ action: Action.create, ownership: Ownership.any }),
              new Permission({ action: Action.update, ownership: Ownership.any }),
              new Permission({ action: Action.delete, ownership: Ownership.any }),
            ]
          })
        ]
      }));
    }

    superUser = await db.users.create(new User({
      username: config.tenant.superUser.username,
      password: config.tenant.superUser.password,
      person: new Person({
        firstName: 'Super',
        lastName: 'User',
        gender: Gender.male
      }),
      roles: [superRole]
    }));
  }
  return superUser;
}

type DbContext = {
  users: ReturnModelType<typeof User, unknown>,
  roles: ReturnModelType<typeof Role, unknown>,
}

let dbContext: DbContext;

let counter = 0;

export const initDbContext = async ({ successFn, errorFn }: Args = {}) => {
  if (dbContext) {
    return dbContext;
  }

  counter++;

  logger.error(`INITIALIZATION: ${counter}`);

  await initConnection({ successFn, errorFn });

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
  }

  dbContext = {
    roles: getModelForClass(Role, defaultModelOption),
    users: getModelForClass(User, userModelOptions)
  }

  await initializeData(dbContext);

  await ensureSuperUser(dbContext);

  return dbContext;
}

