import { Role } from './role.models';
import { PageResponse, PageRequest, SortDirection, parsePageFrom, builderDef, Lookup } from '../../common/contract.models';
import { addEntryWhen, isNotNullOrDefault, addItemWhen, valueOrNone, sortDirectionIsNotNone } from '../../common/helpers/query.helpers';
import { initDbContext } from '../../db.context';

type RoleIdContract = string;

type RoleContract = Role;

type RoleFilterRequest = { keyword: string }

type RoleSortRequest = { 
  active?: SortDirection, 
  name?: SortDirection, 
  description?: SortDirection 
}

type RolePageRequest = PageRequest<RoleFilterRequest, RoleSortRequest>;

type RolePageResponse = PageResponse<RoleContract>;

const lookup = async () => {
  const db = await initDbContext();
  const build = builderDef<Role>();
  const sort = build().sort([['name', 'asc']])
  const projection = build().projection(['_id', 'name']);
  const roles = await db.roles.find({ active: true }, projection, sort).exec();
  const lookups = roles.map<Lookup>(x => ({ id: x._id, name: x.name }));
  return lookups;
}

const find = async (request: RolePageRequest) => {
  const filter = {
    ...addEntryWhen(request.filter?.keyword, {
      when: isNotNullOrDefault,
      map: (value) => ({
        $or: [
          { 'name': { $regex: `${value}` } },
          { 'description': { $regex: `${value}` } }
        ]
      })
    })
  };

  const sort: string[][] = [
    ...addItemWhen(valueOrNone(request.sort?.active), {
      when: sortDirectionIsNotNone,
      map: (value) => ['active', value]
    }),
    ...addItemWhen(valueOrNone(request.sort?.name), {
      when: sortDirectionIsNotNone,
      map: (value) => ['name', value]
    }),
    ...addItemWhen(valueOrNone(request.sort?.description), {
      when: sortDirectionIsNotNone,
      map: (value) => ['description', value]
    }),
  ];

  const db = await initDbContext();
  const { skip, limit } = parsePageFrom(request);
  const [total, items] = await Promise.all([
    db.roles.find(filter).countDocuments().exec(),
    db.roles.find(filter).sort(sort).skip(skip).limit(limit).exec()
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
  const { id } = await db.roles.create<any>(role); // WORK AROUND: https://github.com/typegoose/typegoose/issues/298
  return <RoleIdContract>id;
}

const update = async (id: RoleIdContract, role: RoleContract) => {
  const db = await initDbContext();
  await db.roles.findByIdAndUpdate(id, role).exec();
}

const patch = async (id: RoleIdContract, role: Partial<RoleContract>) => {
  const db = await initDbContext();
  await db.roles.findByIdAndUpdate(id, role).exec();
}

const remove = async (id: RoleIdContract) => {
  const db = await initDbContext();
  await db.roles.findByIdAndDelete(id).exec();
}

const roleService = {
  get,
  find,
  lookup,
  create,
  update,
  patch,
  remove
};

export {
  roleService,
  RoleContract,
  RoleIdContract,
  RolePageRequest,
  RolePageResponse
}