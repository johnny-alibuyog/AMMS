import { Address, initAddress } from 'features/common/address/address.model';
import { Branch, BranchId } from '../branches/branch.models';
import { Image, ImageId } from 'features/common/images/image.models';
import { Person, initPerson } from 'features/common/person/person.model';
import { Role, RoleId } from '../roles/role.models';

import { SortDirection } from './../../../common/services/pagination';

type UserId = string;

type User = {
  id: UserId,
  username: string,
  email: string,
  password?: string,
  person: Person,
  address?: Address,
  photo?: Image | ImageId,
  branches: Branch[] | BranchId[],
  roles: Role[] | RoleId[]
}

type UserSort = {
  username?: SortDirection,
  email?: SortDirection,
  name?: SortDirection
}

type UserFilter = {
  keyword?: string,
  roles?: RoleId[],
  branches?: BranchId[]
}

const initUser = (): User => ({
  id: '',
  username: '',
  email: '',
  person: initPerson(),
  address: initAddress(),
  branches: [],
  roles: []
});

const initSort = (): UserSort => ({
  username: 'asc',
  email: 'none',
  name: 'none'
});

const initFilter = (): UserFilter => ({
  keyword: '',
  branches: [],
  roles: []
});

const isUserNew = (user: User) => !user?.id;

export {
  User,
  UserId,
  UserSort,
  UserFilter,
  initUser,
  initSort,
  initFilter,
  isUserNew
}
