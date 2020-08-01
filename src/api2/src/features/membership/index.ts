import auth from './auth';
import branches from './branches';
import roles from './roles';
import users from './users';

export default [...auth, ...users, ...roles, ...branches];