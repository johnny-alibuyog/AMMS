import { AccessControl, Action, Ownership, Permission, Resource } from '../../roles/role.models';
import { BranchContract, BranchIdContract } from '../branch.services';
import { IBuilder, UserBuilderArgs, createUserBuilder, getToken } from '../../../../utils/client.data.builder';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { UserContract } from '../../users/user.services';
import { basePath } from '..';
import { buildClient } from '../../../../client';
import { randomizeBranches } from '../data/branch.randomizer';

const feature = loadFeature('./branch.feature', { loadRelativePath: true });

const client = buildClient<BranchIdContract, BranchContract>(() => basePath());

defineFeature(feature, test => {

  test('Branch Crud', ({ given, when, then }) => {
    let branchToBeCreated: BranchContract;
    let branchToBeUpdatedWith: BranchContract;
    let userBuilder: IBuilder<UserBuilderArgs, UserContract>;
    let branchId: BranchIdContract;
    let token: string;

    beforeAll(async () => {
      branchToBeCreated = randomizeBranches(1)[0];
      branchToBeUpdatedWith = randomizeBranches(1)[0];
      const params = {
        email: 'some.user@gmail.com',
        username: 'some_user_with_user_admin',
        password: 'some_password',
        accessControl: new AccessControl({
          resource: Resource.membership_branch,
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

    given('a branch has been created', async () => {
      branchId = await client(token).create(branchToBeCreated);
    });

    when('the branch is updated', async () => {
      await client(token).update(branchId, branchToBeUpdatedWith);
    });

    then('the branch reflects the changes', async () => {
      const branchFromDb = await client(token).get(branchId) as BranchContract;
      expect(branchFromDb.name).toBe(branchToBeUpdatedWith.name);
    });

    then('the branch is deletable', async () => {
      const branchFromDb = await client(token).get(branchId);
      expect(branchFromDb).not.toBeNull();
    });
  });
});