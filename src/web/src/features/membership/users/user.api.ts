import apiBuilder from "kernel/api-builder";
import { UserId, User, UserFilter, UserSort } from './user.models';

const userApi = apiBuilder<UserId, User, UserFilter, UserSort, User>('users');

export { userApi }
