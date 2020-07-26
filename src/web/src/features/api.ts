import { authApi } from './membership/auth/auth.api';
import { userApi } from './membership/users/user.api';
import { roleApi } from './membership/roles/role.api';
import { imageApi } from './common/images/image.api';

const api = {
  auth: authApi,
  users: userApi,
  roles: roleApi,
  images: imageApi
}

export { api }
