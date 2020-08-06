import { Address, initAddress } from "features/common/address/address.model";

import { SortDirection } from "common/services/pagination";

type BranchId = string;

type Branch = {
  id: BranchId,
  name: string;
  active: boolean;
  mobile?: string;
  landline?: string;
  email?: string;
  address?: Address;
}

type BranchSort = {
  name?: SortDirection,
  active?: SortDirection,
  mobile?: SortDirection,
  landline?: SortDirection,
  email?: SortDirection,
  address?: SortDirection
}

type BranchFilter = {
  keyword?: string,
  active?: boolean,
  mobile?: string,
  landline?: string,
  email?: string,
  address?: string
}


const initBranch = (): Branch => ({
  id: '',
  name: '',
  active: true,
  mobile: '',
  landline: '',
  email: '',
  address: initAddress()
});

const initSort = (): BranchSort => ({
  name: 'asc',
  active: 'none',
  mobile: 'none',
  landline: 'none',
  email: 'none',
  address: 'none'
});

const initFilter = (): BranchFilter => ({ 
  keyword: '',
  active: null,
  mobile: '',
  landline: '',
  email: '',
  address: '', 
});

const isBranchNew = (branch: Branch) => !branch?.id;

export {
  initBranch,
  initSort,
  initFilter,
  isBranchNew,
  Branch,
  BranchId,
  BranchSort,
  BranchFilter
}