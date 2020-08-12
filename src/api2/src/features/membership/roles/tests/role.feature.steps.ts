import { AccessControl, Action, Permission } from '../role.models';
import { IBuilder, UserBuilderArgs, createUserBuilder, getToken } from '../../../../utils/client.data.builder';
import { RoleContract, RoleIdContract } from '../role.services';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { HTTP404Error } from '../../../../utils/http.errors';
import { Ownership } from '../../../common/ownership/ownership.model';
import { UserContract } from '../../users/user.services';
import { basePath } from '..';
import { buildClient } from '../../../../client';
import { randomizeRoles } from '../data/role.randomizer';
import { resources } from '../../resources/data/resource.data';

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
          resource: resources.membership.role._id,
          permissions: [
            new Permission({ action: Action.read, ownership: Ownership.owned }),
            new Permission({ action: Action.create, ownership: Ownership.owned }),
            new Permission({ action: Action.update, ownership: Ownership.owned }),
            new Permission({ action: Action.delete, ownership: Ownership.owned }),
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
      await client(token).remove(roleId);
      await expect(client(token).get(roleId)).rejects.toEqual(new HTTP404Error());
    });
  });
});