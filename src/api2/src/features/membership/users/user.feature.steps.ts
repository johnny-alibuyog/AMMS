import { userSeed } from './user.seed';
import { roleSeed } from './../roles/role.seed';
import { buildClient } from '../../../client';
import { basePath as userPath } from '.';
import { basePath as rolePath } from '../roles';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { UserIdContract, UserContract } from './user.services';
import { RoleIdContract, RoleContract } from '../roles/role.services';
import { AccessControl, Resource, Permission, Action, Ownership } from '../roles/role.models';
import { IBuilder, createUserBuilder, getToken, UserBuilderArgs } from '../../../utils/client.data.builder';

const feature = loadFeature('./user.feature', { loadRelativePath: true });

const userClient = buildClient<UserIdContract, UserContract>(() => userPath());
const roleClient = buildClient<RoleIdContract, RoleContract>(() => rolePath());

defineFeature(feature, test => {

  test('User Crud', ({ given, when, then }) => {
    let userToBeCreated: UserContract;
    let userToBeUpdatedWith: UserContract;
    let userBuilder: IBuilder<UserBuilderArgs, UserContract>;
    let userId: UserIdContract;
    let token: string;

    beforeAll(async () => {
      const roles = await (async () => {
        const superToken = await getToken();
        const rolesId = await Promise.all(
          roleSeed.randomRoles(3)
            .map(x => roleClient(superToken).create(x))
        );

        const result = await Promise.all(
          rolesId.map(x => roleClient(superToken).get(x))
        );

        return result.map(x => x as RoleContract);
      })();

      const randomUsers = userSeed.randomUsersFn(() => roles);

      userToBeCreated = randomUsers(1)[0];

      userToBeUpdatedWith = randomUsers(1)[0];

      const params = {
        email: 'some.user@gmail.com',
        username: 'some_user_with_user_admin',
        password: 'some_password',
        accessControl: new AccessControl({
          resource: Resource.membership_user,
          permissions: [
            new Permission({ action: Action.read, ownership: Ownership.all }),
            new Permission({ action: Action.create, ownership: Ownership.all }),
            new Permission({ action: Action.update, ownership: Ownership.all }),
            new Permission({ action: Action.delete, ownership: Ownership.all }),
          ]
        })
      };
      userBuilder = await createUserBuilder();
      await userBuilder.build(params);
      token = await getToken({ username: params.username, password: params.password });
    });

    afterAll(async () => {
      await userBuilder.clean();
    });

    given('a user has been created', async () => {
      userId = await userClient(token).create(userToBeCreated);
    });

    when('the user is updated', async () => {
      await userClient(token).update(userId, userToBeUpdatedWith);
    });

    then('the user reflects the changes', async () => {
      const userFromDb = await userClient(token).get(userId) as UserContract;
      expect(userFromDb.username).toBe(userToBeUpdatedWith.username);
    });

    then('the user is deletable', async () => {
      const userFromDb = await userClient(token).get(userId);
      expect(userFromDb).not.toBeNull();
    });
  });
});