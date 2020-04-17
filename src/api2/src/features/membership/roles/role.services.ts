import { Role } from './role.models';
import { initDbContext } from '../../db.context';
import { skipCount, PageResponse, PageRequest } from '../../kernel/contract.models';

type RoleIdContract = string;

type RoleContract = Role;

type RolePageRequest = PageRequest & {};

type RolePageResponse = PageResponse<RoleContract>;

const find = async (request: RolePageRequest) => {
  const db = await initDbContext();
  const [total, items] = await Promise.all([
    db.roles.find({}).countDocuments().exec(),
    db.roles.find({}).skip(skipCount(request)).limit(request.size).exec()
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