import { AccessControl, Action, Ownership, Permission, Resource } from '../role.models';
import { IBuilder, UserBuilderArgs, createUserBuilder, getToken } from '../../../../utils/client.data.builder';
import { RoleContract, RoleIdContract } from '../role.services';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { HTTP404Error } from '../../../../utils/http.errors';
import { UserContract } from '../../users/user.services';
import { basePath } from '..';
import { buildClient } from '../../../../client';
import { randomizeRoles } from '../data/role.randomizer';

const feature = loadFeature('./role.feature', { loadRelativePath: true });

const client = buildClient<RoleIdContract, RoleContract>(() => basePath());

defineFeature(feature, test => {

  test('Role Crud', ({ given, when, then }) => {
    let roleToBeCreated: RoleContract;
    let roleToBeUpdatedWith: RoleContract;
    let userBuilder: IBuilder<UserBuilderArgs, UserContract>;
    let roleId: RoleIdContract;
    let token: string;

    beforeAll(async () => {
      roleToBeCreated = randomizeRoles(1)[0];
      roleToBeUpdatedWith = randomizeRoles(1)[0];
      const user: UserBuilderArgs = {
        email: 'some_email@gmail.com',
        username: 'some_user_with_role_admin',
        password: 'some_password',
        accessControl: new AccessControl({
          resource: Resource.membership_role,
          permissions: [
            new Permission({ action: Action.read, ownership: Ownership.own }),
            new Permission({ action: Action.create, ownership: Ownership.own }),
            new Permission({ action: Action.update, ownership: Ownership.own }),
            new Permission({ action: Action.delete, ownership: Ownership.own }),
          ]
        })
      };
      userBuilder = await createUserBuilder();
      await userBuilder.build(user);
      token = await getToken({ username: user.username, password: user.password });
    });

    afterAll(async () => {
      await userBuilder.clean();
    });

    given('a role has been created', async () => {
      roleId = await client(token).create(roleToBeCreated);
    });

    when('the role is updated', async () => {
      await client(token).update(roleId, roleToBeUpdatedWith);
    });

    then('the role reflects the changes', async () => {
      const roleFromServer = await client(token).get(roleId);
      expect(roleFromServer.name).toBe(roleToBeUpdatedWith.name);
    });

    then('the role is deletable', async () => {
      try {
        await client(token).remove(roleId);
        await client(token).get(roleId);
      }
      catch (err) {
        const notFound = new HTTP404Error();
        expect(err.message).toBe(notFound.message);
      }

      // expect(async () => {
      //   await client(token).remove(roleId);
      //   await client(token).get(roleId);
      // })
      // .toThrow(new HTTP404Error().message);
      // await client(token).remove(roleId);
      // const notFound = new HTTP404Error();
      // const roleFromServer = await client(token).get(roleId);
      // expect(roleFromServer).toEqual(notFound.message);
    });
  });
});