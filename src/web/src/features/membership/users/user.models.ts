import { SortDirection } from './../../../common/services/pagination';
import { Role, RoleId } from '../roles/role.models';

enum Gender {
  male = 'Male',
  female = 'Female',
  others = 'Others'
}

type Person = {
  firstName: string,
  middleName?: string,
  lastName: string,
  gender: Gender,
  birthDate?: Date
}

type Address = {
  unit?: string,
  street?: string,
  subdivision?: string,
  district?: string,
  municipality?: string,
  province?: string,
  country?: string,
  zipcode?: string
}

type UserId = string;

type User = {
  id: UserId,
  username: string,
  email: string,
  password?: string,
  person: Person,
  addressInfo?: Address[],
  roles: Role[] | RoleId[]
}

type UserSort = { username: SortDirection, email: SortDirection, name: SortDirection }

type UserFilter = { keyword: string, roles: RoleId[] }

const initSort = (): UserSort => ({
  username: 'asc',
  email: 'none',
  name: 'none'
});

const initFilter = (roles: RoleId[] = []): UserFilter => ({ 
  keyword: '', 
  roles: roles 
});

export {
  Gender,
  Person,
  Address,
  User,
  UserId,
  UserSort,
  UserFilter,
  initSort,
  initFilter,
}
