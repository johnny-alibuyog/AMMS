import { Role } from './role.models';
import { initDbContext } from '../../db.context';
import { PageResponse, PageRequest, SortDirection, parsePageFrom, builderDef, Lookup } from '../../common/contract.models';

type RoleIdContract = string;

type RoleContract = Role;

type RoleFilterRequest = { keyword: string }

type RoleSortRequest = { name: SortDirection }

type RolePageRequest = PageRequest<RoleFilterRequest, RoleSortRequest>;

type RolePageResponse = PageResponse<RoleContract>;

const build = builderDef<Role>();

const find = async (request: RolePageRequest) => {
  const db = await initDbContext();
  const { skip, limit } = parsePageFrom(request);
  const [total, items] = await Promise.all([
    db.roles.find({}).countDocuments().exec(),
    db.roles.find({}).skip(skip).limit(limit).exec()
  ]);
  const response: RolePageResponse = {
    total: total,
    items: items
  }
  return response;
}

const get = async (id: RoleIdContract) => {
  const db = await initDbContext();
  const role = await db.roles.findById(id).exec();
  return <RoleContract>role;
}

const lookup = async () => {
  const db = await initDbContext();
  const sort = build().sort([['name', 'asc']])
  const projection = build().projection(['_id', 'name']);
  const roles = await db.roles.find({}, projection, sort).exec();
  const lookups: Lookup[] = roles.map(x => ({ id: x._id, name: x.name }));
  return lookups;
}

const create = async (role: RoleContract) => {
  const db = await initDbContext();
  const { id } = await db.roles.create(role);
  return <RoleIdContract>id;
}

const update = async (id: RoleIdContract, role: RoleContract) => {
  const db = await initDbContext();
  await db.roles.findByIdAndUpdate(id, role).exec();
}

const remove = async (id: RoleIdContract) => {
  const db = await initDbContext();
  await db.roles.findByIdAndDelete(id).exec();
}

const roleService = {
  find,
  get,
  lookup,
  create,
  update,
  remove
};

export {
  roleService,
  RoleContract,
  RoleIdContract,
  RolePageRequest,
  RolePageResponse
}