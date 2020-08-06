import { Role, RoleFilter, RoleId, RoleSort } from "./role.models";

import apiBuilder from "kernel/api-builder";

const roleApi = apiBuilder<RoleId, Role, RoleFilter, RoleSort, Role>('roles');

export { roleApi }
