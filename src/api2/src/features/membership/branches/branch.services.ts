import { Branch } from './branch.models';
import { logger } from '../../../utils/logger';
import { context } from '../../../utils/request.context';
import { initDbContext } from '../../db.context';
import { PageResponse, PageRequest, SortDirection, parsePageFrom } from '../../common/contract.models';

type BranchIdContract = string;

type BranchContract = Branch;

type BranchFilterRequest = { keyword?: string }

type BranchSortRequest = { email?: SortDirection, name?: SortDirection }

type BranchPageRequest = PageRequest<BranchFilterRequest, BranchSortRequest>;

type BranchPageResponse = PageResponse<BranchContract>;

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

const find = async (request: BranchPageRequest) => {
  const db = await initDbContext();
  // https://stackoverflow.com/questions/56021631/add-elements-inside-array-conditionally-in-javascript

  const filter = {
    ...addEntryWhen(request.filter?.keyword, {
      when: isNotNullOrDefault,
      map: (value) => ({
        $or: [
          { 'name': { $regex: `${value}` } },
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
  ];
  const { skip, limit } = parsePageFrom(request);
  const [total, items] = await Promise.all([
    db.branches.find(filter).countDocuments().exec(),
    db.branches.find(filter, null, sort).skip(skip).limit(limit).exec()
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

const remove = async (id: BranchIdContract) => {
  const db = await initDbContext();
  await db.branches.findByIdAndDelete(id).exec();
}

const branchService = {
  find,
  get,
  create,
  update,
  remove
};

export {
  branchService,
  BranchContract,
  BranchIdContract,
  BranchPageRequest,
  BranchPageResponse
}