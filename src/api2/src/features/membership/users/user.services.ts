import { User } from './user.models';
import { initDbContext } from '../../db.context';
import { logger } from '../../../utils/logger';
import { context } from '../../../utils/request.context';
import { skipCount, PageResponse, PageRequest } from '../../kernel/contract.models';

type UserIdContract = string;

type UserContract = Omit<User, 'passwordHash' | 'passwordSalt'>;

type UserPageRequest = PageRequest & {};

type UserPageResponse = PageResponse<UserContract>;

const find = async (request: UserPageRequest) => {
  logger.info(`CONTEXT MAN: ${JSON.stringify(context.current())}`);
  const db = await initDbContext();
  const [total, items] = await Promise.all([
    db.users.find({}).countDocuments().exec(),
    db.users.find({}).skip(skipCount(request)).limit(request.size).exec()
  ]);
  const response: UserPageResponse = { 
    total: total,
    items: items
  };
  return response;
}

const get = async (id: UserIdContract) => {
  logger.info(`CONTEXT MAN: ${JSON.stringify(context.current())}`);
  const db = await initDbContext();
  const user = await db.users.findById(id).populate('roles').exec();
  return <UserContract>user;
}

const create = async (user: UserContract) => {
  const db = await initDbContext();
  const newUser = await db.users.create(user);
  return <UserIdContract>newUser.id;
}

const update = async (id: UserIdContract, user: UserContract) => {
  const db = await initDbContext();
  await db.users.findByIdAndUpdate(id, user).exec();
}

const remove = async (id: UserIdContract) => {
  const db = await initDbContext();
  await db.users.findByIdAndDelete(id).exec();
}

const userService = {
  find,
  get,
  create,
  update,
  remove
};

export {
  userService,
  UserContract,
  UserIdContract,
  UserPageRequest,
  UserPageResponse
}