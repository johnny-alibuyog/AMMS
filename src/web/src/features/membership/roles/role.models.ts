import { Resource, ResourceId } from "../resources/resource.model";

import { Ownership } from "features/common/ownership/ownership.model";
import { SortDirection } from "common/services/pagination";

enum Action {
  all = 'All',
  read = 'Read',
  create = 'Create',
  update = 'Update',
  delete = 'Delete',
}

type Permission = {
  action: Action,
  ownership: Ownership
}

type AccessControl = {
  resource: Resource | ResourceId,
  permissions: Permission[]
}

type RoleId = string;

type Role = {
  id: RoleId,
  name: string,
  description?: string,
  active: boolean,
  accessControls: AccessControl[],
}

type RoleSort = { 
  name: SortDirection, 
  active: SortDirection,
  description: SortDirection 
}

type RoleFilter = { keyword: string }

const initRole = (): Role => ({
  id: '',
  name: '',
  description: '',
  active: true,
  accessControls: []
});

const initSort = (): RoleSort => ({
  name: 'asc',
  active: 'none',
  description: 'none'
});

const initFilter = (): RoleFilter => ({ 
  keyword: '',
});

const isRoleNew = (role: Role) => !role?.id;

export {
  Resource,
  Action,
  Permission,
  AccessControl,
  Role,
  RoleId,
  RoleSort,
  RoleFilter,
  initRole,
  initFilter,
  initSort,
  isRoleNew
}
