import { config } from "../config";
import { logger } from "./logger";
import { userSeed } from './../features/membership/users/user.seed';
import { roleSeed } from './../features/membership/roles/role.seed';
import { IClient, buildClient, request } from "../client";
import { AccessControl, Permission  } from "../features/membership/roles/role.models";
import { RoleIdContract, RoleContract } from "../features/membership/roles/role.services";
import { UserIdContract, UserContract } from '../features/membership/users/user.services';
import { basePath as authBasePath } from '../features/membership/auth';
import { basePath as roleBasePath } from '../features/membership/roles';
import { basePath as userBasePath } from '../features/membership/users';
import { LoginRequest, LoginResponse } from "../features/membership/auth/auth.service";

class Builder<TId extends Object, TModel extends Object> {
  private _id: TId;
  private _model: TModel;

  constructor(
    modelInit: () => TModel,
    private readonly _client: IClient<TId, TModel>
  ) {
    this._id = <TId>{};
    this._model = modelInit();
  }

  public with(value: Partial<TModel>): Builder<TId, TModel> {
    this._model = Object.assign(this._model, value);
    return this;
  }

  public async build(): Promise<TModel> {
    this._id = await this._client.create(this._model) as TId;
    this._model = await this._client.get(this._id || '') as TModel;
    return this._model;
  }

  public async clean(): Promise<void> {
    await this._client.remove(this._id || '');
  }
}

export type IBuilder<TArgs, TModel> = {
  build: (args: TArgs) => Promise<TModel>,
  clean: () => Promise<void>
}

// type IArgs<TResult> = {};

// type UserBuilderArgs2<UserContract> = {
//   username: string,
//   password: string,
//   permission?: Permission,
// }

// type IBuilder2<TResult> = {
//   build: <TResult>(args: IArgs<TResult>) => Promise<TResult>,
//   clean: () => Promise<void>
// }


// type IBuilder3<TResult, TArgs extends IArgs<TResult>> = {
//   build: <TResult>(args: IArgs<TResult>) => Promise<TResult>,
//   clean: () => Promise<void>
// }


export type UserBuilderArgs = {
  username: string,
  email: string,
  password: string,
  accessControl?: AccessControl
}

const createUserBuilder = async (token?: string): Promise<IBuilder<UserBuilderArgs, UserContract>> => {
  if (!token) {
    token = await getToken(config.tenant.superUser);
  }
  const userClient = buildClient<UserIdContract, UserContract>(() => userBasePath());
  const roleClient = buildClient<RoleIdContract, RoleContract>(() => roleBasePath());
  const userBuilder = new Builder(() => userSeed.randomUsersFn(() => [])(1)[0], userClient(token));
  const roleBuilder = new Builder(() => roleSeed.randomRoles(1)[0], roleClient(token));
  let user: UserContract;

  return {
    build: async (args: UserBuilderArgs) => {
      if (!user) {
        if (args.accessControl) {
          roleBuilder.with({ accessControls: [args.accessControl] });
        }
        const role = await roleBuilder.build();
        user = await userBuilder
          .with({ 
            username: args.username, 
            password: args.password, 
            roles: [role] 
          })
          .build();
      }
      return user;
    },
    clean: async () => {
      await Promise.all([
        roleBuilder.clean(),
        userBuilder.clean()
      ]);
    }
  }
}

const createRoleBuilder = (token?: string) => {

}

const getToken = async (credentials?: LoginRequest): Promise<string> => {
  const loginUrl = authBasePath().resource('login').build();
  const response = await request.post(loginUrl).send(credentials ?? config.tenant.superUser);
  const auth = response.body as LoginResponse;
  return auth.token;
};

export {
  getToken,
  createUserBuilder
}

// const roleBuilder = (token?: string): Builder<RoleIdContract, RoleContract> => {
//   const roleClient = buildClient<RoleIdContract, RoleContract>(() => roleBasePath());
//   const role: RoleContract = roleSeed.randomRoles(1)[0];
//   const builder = new Builder(role, roleClient(token));
//   return builder;
// }

// roleBuilder('').with({ permissions: [Permission.superPermission] });

// const createRole = async (
//   client: IClient<RoleIdContract, RoleContract>,
//   { resource, rights }: Permission
// ): Promise<RoleContract> => {
//   const roleToCreate: RoleContract = {
//     name: faker.name.jobTitle(),
//     permissions: [
//       new Permission({
//         resource: resource,
//         rights: rights
//       }),
//     ]
//   };
//   const roleId = await client.create(roleToCreate) as RoleIdContract;
//   const role = await client.get(roleId) as RoleContract;
//   return role;
// }

// async function createUser(
//   client: IClient<UserIdContract, UserContract>,
//   { username, password, role }: LoginCredential & { role: Role }
// ): Promise<UserContract> {
//   const userToCreate = {
//     ...userSeed.randomUsersFn(() => [role])(1)[0],
//     username: username,
//     roles: [role]
//   };
//   const userId = await client.create(userToCreate);
//   const user = await client.get(userId) as UserContract;
//   return user;
// }
