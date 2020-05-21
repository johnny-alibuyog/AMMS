import apiBuilder from "kernel/api-builder";
import { RoleId, Role, RoleFilter, RoleSort } from "./role.models";

const roleApi = apiBuilder<RoleId, Role, RoleFilter, RoleSort, Role>('roles');

export { roleApi }
