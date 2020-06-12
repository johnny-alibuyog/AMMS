import { User } from './user.models';
import { logger } from '../../../utils/logger';
import { context } from '../../../utils/request.context';
import { initDbContext } from '../../db.context';
import { RoleIdContract } from '../roles/role.services';
import { PageResponse, PageRequest, SortDirection, parsePageFrom } from '../../common/contract.models';

type UserIdContract = string;

type UserContract = Omit<User, 'passwordHash' | 'passwordSalt'>;

type UserFilterRequest = { keyword?: string, roles?: RoleIdContract[] }

type UserSortRequest = { username?: SortDirection, email?: SortDirection, name?: SortDirection }

type UserPageRequest = PageRequest<UserFilterRequest, UserSortRequest>;

type UserPageResponse = PageResponse<UserContract>;

const isNullOrDefault = <T>(value: T): boolean => {
  if (value == null) {
    return true;
  }
  if (value == undefined) {
    return true;
  }
  if (typeof value === 'string' /* value instanceof String */) {
    return value.trim().length === 0;
  }
  if (value instanceof Array) {
    return value.length === 0;
  }
  if (value instanceof Object) {
    return Object.keys(value).length > 0;
  }
  return false;
}

const isNotNullOrDefault = <T>(value: T): boolean => !isNullOrDefault(value);

type EvalParam<T, M> = {
  when: (item: T) => boolean,
  map: (item: T) => M
}

const addItemWhen = <T, M>(value: T, evaluator: EvalParam<T, M>): M[] =>
  evaluator.when(value) ? [evaluator.map(value)] : [];

const addItemIf = <T>(condition: () => boolean, item: T): T[] =>
  condition() ? [item] : [];

const addEntryWhen = <T, M>(value: T, evaluator: EvalParam<T, M>): {} =>
  evaluator.when(value) && evaluator.map(value);

const addEntryIf = (condition: () => boolean, entry: {}): {} =>
  condition() && entry;

const find = async (request: UserPageRequest) => {
  const db = await initDbContext();
  // https://stackoverflow.com/questions/56021631/add-elements-inside-array-conditionally-in-javascript

  const filter = {
    ...addEntryWhen(request.filter?.keyword, {
      when: isNotNullOrDefault,
      map: (value) => ({
        $or: [
          { 'email': { $regex: `${value}` } },
          { 'username': { $regex: `${value}` } },
          { 'person.firstName': { $regex: `${value}` } },
          { 'person.middleName': { $regex: `${value}` } },
          { 'person.lastName': { $regex: `${value}` } },
        ]
      })
    }),
    ...addEntryWhen(request.filter?.roles, {
      when: isNotNullOrDefault,
      map: (value) => ({
        roles: { $in: value }
      })
    })
  };

  const sortDirectionIsNotNone = (dir: SortDirection = 'none') =>
    isNotNullOrDefault(dir) && dir != 'none';

  const valueOrNone = (dir?: SortDirection) => dir ? dir : 'none';

  const sort: string[][] = [
    ...addItemWhen(valueOrNone(request.sort?.email), {
      when: sortDirectionIsNotNone,
      map: (value) => ['email', value]
    }),
    ...addItemWhen(valueOrNone(request.sort?.username), {
      when: sortDirectionIsNotNone,
      map: (value) => ['username', value]
    }),
    ...addItemWhen(valueOrNone(request.sort?.name), {
      when: sortDirectionIsNotNone,
      map: (value) => [
        ['person.firstName', value],
        ['person.lastName', value],
      ]
    }).flat()
  ];
  const { skip, limit } = parsePageFrom(request);
  const [total, items] = await Promise.all([
    db.users.find(filter).countDocuments().exec(),
    db.users.find(filter, null, sort).skip(skip).limit(limit).exec()
  ]);
  const response: UserPageResponse = {
    total: total,
    items: items
  };
  logger.info(`RESPONSE: ${JSON.stringify(response)}`);
  return response;
}

const get = async (id: UserIdContract) => {
  logger.info(`CONTEXT MAN: ${JSON.stringify(context.current())}`);
  const db = await initDbContext();
  const user = await db.users.findById(id).exec();
  // const user = await db.users.findById(id).populate('roles').exec();
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