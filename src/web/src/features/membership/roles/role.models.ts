import { SortDirection } from "common/services/pagination";

enum Resource {
  all = 'All',
  membership_tenant = 'Membership:Tenants',
  membership_tenant_user_settings = 'Membership:Tenants.Users.Settings',
  membership_branch = 'Membership:Branches',
  membership_role = 'Membership:Role',
  membership_user = 'Membership:Users',
  membership_user_password = 'Membership:Users.Password',
}

enum Action {
  all = 'All',
  read = 'Read',
  create = 'Create',
  update = 'Update',
  delete = 'Delete',
}

enum Ownership {
  own = 'Own',
  managed = 'Managed',
  any = 'Any'
}

type Permission = {
  action: Action,
  ownership: Ownership
}

type AccessControl = {
  resource: Resource,
  permissions: Permission[]
}

type RoleId = string;

type Role = {
  id: RoleId,
  name: string,
  active: boolean,
  accessControls: AccessControl[],
}

type RoleSort = { name: SortDirection, active: SortDirection }

type RoleFilter = { keyword: string }

const initRole = (): Role => ({
  id: '',
  name: '',
  active: true,
  accessControls: []
});

const initSort = (): RoleSort => ({
  name: 'asc',
  active: 'none'
});

const initFilter = (): RoleFilter => ({ 
  keyword: '',
});

export {
  Resource,
  Action,
  Ownership,
  Permission,
  AccessControl,
  Role,
  RoleId,
  RoleSort,
  RoleFilter,
  initRole,
  initFilter,
  initSort
}
