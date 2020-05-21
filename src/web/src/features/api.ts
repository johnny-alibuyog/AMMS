import { authApi } from './membership/auth/auth.api';
import { userApi } from './membership/users/user.api';
import { roleApi } from './membership/roles/role.api';

const api = {
  auth: authApi,
  users: userApi,
  roles: roleApi
}

export { api }
