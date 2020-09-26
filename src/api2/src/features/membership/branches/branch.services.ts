import { Branch } from './branch.models';
import { logger } from '../../../utils/logger';
import { context } from '../../../utils/request.context';
import { initDbContext } from '../../db.context';
import { PageResponse, PageRequest, SortDirection, parsePageFrom, builderDef, Lookup } from '../../common/contract.models';
import { addEntryWhen, isNotNullOrDefault, addItemWhen } from '../../common/helpers/query.helpers';

type BranchIdContract = string;

type BranchContract = Branch;

// type BranchActiveContract = Pick<Branch, 'active'>;

type BranchFilterRequest = { keyword?: string }

type BranchSortRequest = { 
  name?: SortDirection,
  mobile?: SortDirection,
  landline?: SortDirection,
  email?: SortDirection, 
}

type BranchPageRequest = PageRequest<BranchFilterRequest, BranchSortRequest>;

type BranchPageResponse = PageResponse<BranchContract>;

const lookup = async () => {
  const db = await initDbContext();
  const build = builderDef<Branch>();
  const sort = build().sort([['name', 'asc']])
  const projection = build().projection(['_id', 'name']);
  const branches = await db.branches.find({ active: true }, projection, sort).exec();
  const lookups = branches.map<Lookup>(x => ({ id: x._id, name: x.name }));
  return lookups;
}

const find = async (request: BranchPageRequest) => {
  const db = await initDbContext();
  // https://stackoverflow.com/questions/56021631/add-elements-inside-array-conditionally-in-javascript

  const filter = {
    ...addEntryWhen(request.filter?.keyword, {
      when: isNotNullOrDefault,
      map: (value) => ({
        $or: [
          { 'name': { $regex: new RegExp(`${value}`, 'i') } },
          { 'address.line1': { $regex: `${value}` } },
          { 'address.line2': { $regex: `${value}` } },
          { 'address.municipality': { $regex: `${value}` } },
          { 'address.province': { $regex: `${value}` } },
        ]
      })
    }),
  };

  const sortDirectionIsNotNone = (dir: SortDirection = 'none') =>
    isNotNullOrDefault(dir) && dir != 'none';

  const valueOrNone = (dir?: SortDirection) => dir ? dir : 'none';

  const sort: string[][] = [
    ...addItemWhen(valueOrNone(request.sort?.name), {
      when: sortDirectionIsNotNone,
      map: (value) => ['name', value]
    }),
    ...addItemWhen(valueOrNone(request.sort?.mobile), {
      when: sortDirectionIsNotNone,
      map: (value) => ['mobile', value]
    }),
    ...addItemWhen(valueOrNone(request.sort?.landline), {
      when: sortDirectionIsNotNone,
      map: (value) => ['landline', value]
    }),
    ...addItemWhen(valueOrNone(request.sort?.email), {
      when: sortDirectionIsNotNone,
      map: (value) => ['email', value]
    }),
  ];
  const { skip, limit } = parsePageFrom(request);
  const [total, items] = await Promise.all([
    db.branches.find(filter).countDocuments().exec(),
    db.branches.find(filter).sort(sort).skip(skip).limit(limit).exec()
  ]);
  const response: BranchPageResponse = {
    total: total,
    items: items
  };
  return response;
}

const get = async (id: BranchIdContract) => {
  const db = await initDbContext();
  const branch = await db.branches.findById(id).exec();
  return <BranchContract>branch;
}

const create = async (branch: BranchContract) => {
  const db = await initDbContext();
  const newBranch = await db.branches.create(branch);
  return <BranchIdContract>newBranch.id;
}

const update = async (id: BranchIdContract, branch: BranchContract) => {
  const db = await initDbContext();
  await db.branches.findByIdAndUpdate(id, branch).exec();
}

const patch = async (id: BranchIdContract, branch: Partial<BranchContract>) => {
  const db = await initDbContext();
  await db.branches.findByIdAndUpdate(id, branch).exec();
}

const remove = async (id: BranchIdContract) => {
  const db = await initDbContext();
  await db.branches.findByIdAndDelete(id).exec();
}

const branchService = {
  lookup,
  find,
  get,
  create,
  update,
  patch,
  remove,
};

export {
  branchService,
  BranchContract,
  BranchIdContract,
  BranchPageRequest,
  BranchPageResponse,
  // BranchActiveContract
}