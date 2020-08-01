import { Address, initAddress } from 'features/common/address/address.model';
import { Image, ImageId } from 'features/common/images/image.models';
import { Person, initPerson } from 'features/common/person/person.model';
import { Role, RoleId } from '../roles/role.models';

import { SortDirection } from './../../../common/services/pagination';
import { ValidationRules } from 'aurelia-validation';

type UserId = string;

type User = {
  id: UserId,
  username: string,
  email: string,
  password?: string,
  person: Person,
  address?: Address,
  photo?: Image | ImageId,
  roles: Role[] | RoleId[]
}

type UserSort = {
  username?: SortDirection,
  email?: SortDirection,
  name?: SortDirection
}

type UserFilter = {
  keyword?: string,
  roles?: RoleId[]
}

const initUser = (): User => ({
  id: '',
  username: '',
  email: '',
  person: initPerson(),
  address: initAddress(),
  roles: []
});

const initSort = (): UserSort => ({
  username: 'asc',
  email: 'none',
  name: 'none'
});

const initFilter = (): UserFilter => ({
  keyword: '',
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
