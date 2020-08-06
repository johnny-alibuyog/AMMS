import { authApi } from './membership/auth/auth.api';
import { branchApi } from './membership/branches/branch.api';
import { imageApi } from './common/images/image.api';
import { roleApi } from './membership/roles/role.api';
import { userApi } from './membership/users/user.api';

const api = {
  auth: authApi,
  users: userApi,
  roles: roleApi,
  branches: branchApi,
  images: imageApi
}

export { api }
