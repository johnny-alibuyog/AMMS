import { User, UserFilter, UserId, UserSort } from './user.models';

import apiBuilder from "kernel/api-builder";

const userApi = apiBuilder<UserId, User, UserFilter, UserSort, User>('users');

export { userApi }
