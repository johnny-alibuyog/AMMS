import { AccessControl, Action, Ownership, Permission, Resource } from '../../roles/role.models';
import { IBuilder, UserBuilderArgs, createUserBuilder, getToken } from '../../../../utils/client.data.builder';
import { RoleContract, RoleIdContract } from '../../roles/role.services';
import { UserContract, UserIdContract } from '../user.services';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { buildClient } from '../../../../client';
import { randomizeRoles } from '../../roles/data/role.randomizer';
import { randomizeUsersFn } from '../data/user.randomizer';
import { basePath as rolePath } from '../../roles';
import { basePath as userPath } from '..';

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
        const roleIds = await Promise.all(randomizeRoles(3).map(x => roleClient(superToken).create(x)));
        const result = await Promise.all(roleIds.map(x => roleClient(superToken).get(x)));
        return result.map(x => x as RoleContract);
      })();
      const randomizeUsers = randomizeUsersFn(() => roles);
      userToBeCreated = randomizeUsers(1)[0];
      userToBeUpdatedWith = randomizeUsers(1)[0];
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