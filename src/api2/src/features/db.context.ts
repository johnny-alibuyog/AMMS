import { logger } from './../utils/logger';
import { config } from '../config';
import { ConnectionOptions } from 'mongoose';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { IModelOptions, ReturnModelType } from '@typegoose/typegoose/lib/types';
import { ImageBase } from './common/images/image.models';
import { Address } from './common/address/address.model';
import { Gender, Person } from './common/person/person.model';
import { Role, Resource, AccessControl, Permission, Action, Ownership } from './membership/roles/role.models';
import { User, userModelOptions } from './membership/users/user.models';

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
    logger.info('Creating super user ...');
    let superRole = await db.roles.findOne({
      name: config.tenant.superRole.name
    });
    if (!superRole) {
      logger.info('Creating super role ...');
      superRole = await db.roles.create(new Role({
        name: config.tenant.superRole.name,
        accessControls: [
          new AccessControl({
            resource: Resource.all,
            permissions: [
              new Permission({ action: Action.all, ownership: Ownership.all }),
              new Permission({ action: Action.read, ownership: Ownership.all }),
              new Permission({ action: Action.create, ownership: Ownership.all }),
              new Permission({ action: Action.update, ownership: Ownership.all }),
              new Permission({ action: Action.delete, ownership: Ownership.all }),
            ]
          })
        ]
      }));
    }

    superUser = await db.users.create(new User({
      email: config.tenant.superUser.email,
      username: config.tenant.superUser.username,
      password: config.tenant.superUser.password,
      person: new Person({
        firstName: 'Super',
        lastName: 'User',
        gender: Gender.male,
        birthDate: new Date(1982, 3, 28),
      }),
      address: new Address({
        line1: 'Ocean Street, Virginia Summer Ville',
        line2: 'Mayamot',
        municipality: 'Antipolo City',
        province: 'Rizal'
      }),
      roles: [superRole]
    }));
  }
  return superUser;
}

type DbContext = {
  images: ReturnModelType<typeof ImageBase, unknown>,
  users: ReturnModelType<typeof User, unknown>,
  roles: ReturnModelType<typeof Role, unknown>,
}

let dbContext: DbContext;

export const initDbContext = async ({ successFn, errorFn }: Args = {}) => {
  if (dbContext) {
    return dbContext;
  }

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
    images: getModelForClass(ImageBase, defaultModelOption),
    roles: getModelForClass(Role, defaultModelOption),
    users: getModelForClass(User, userModelOptions),
  }

  await initializeData(dbContext);

  await ensureSuperUser(dbContext);

  return dbContext;
}

