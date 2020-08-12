import { AccessControl, Action, Permission } from '../../roles/role.models';
import { BranchContract, BranchIdContract } from '../branch.services';
import { IBuilder, UserBuilderArgs, createUserBuilder, getToken } from '../../../../utils/client.data.builder';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { HTTP404Error } from '../../../../utils/http.errors';
import { Ownership } from '../../../common/ownership/ownership.model';
import { UserContract } from '../../users/user.services';
import { basePath } from '..';
import { buildClient } from '../../../../client';
import { randomizeBranches } from '../data/branch.randomizer';
import { resources } from '../../resources/data/resource.data';

const feature = loadFeature('./branch.feature', { loadRelativePath: true });

const client = buildClient<BranchIdContract, BranchContract>(() => basePath());

defineFeature(feature, test => {

  let userBuilder: IBuilder<UserBuilderArgs, UserContract>;
  let token: string;

  beforeAll(async () => {
    const params = {
      email: 'some.user@gmail.com',
      username: 'some_user_with_user_admin',
      password: 'some_password',
      accessControl: new AccessControl({
        resource: resources.membership.branch._id,
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


  test('Branch Crud', ({ given, when, then }) => {
    let branchToBeCreated: BranchContract;
    let branchToBeUpdatedWith: BranchContract;
    let branchId: BranchIdContract;

    beforeAll(async () => {
      branchToBeCreated = randomizeBranches(1)[0];
      branchToBeUpdatedWith = randomizeBranches(1)[0];
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
      await client(token).remove(branchId);
      await expect(client(token).get(branchId)).rejects.toEqual(new HTTP404Error());
    });
  });


  test('Branch Activation', ({ given, when, then }) => {
    let inactiveBranch: BranchContract;
    let branchId: BranchIdContract;

    beforeAll(async () => {
      inactiveBranch = randomizeBranches(1, { active: false })[0];
    });

    afterAll(async () => {
      await userBuilder.clean();
    });

    given('a branch has been created with inactive status', async () => {
      branchId = await client(token).create(inactiveBranch);
    });

    when('the branch is activated', async () => {
      await client(token).patch(branchId, { active: true });
    });

    then('the branch has active status', async () => {
      const branchFromDb = await client(token).get(branchId) as BranchContract;
      expect(branchFromDb.active).toBeTruthy();
    });

    then('is available in lookup', async () => {
      const branchLookup = await client(token).lookup();
      const branch = branchLookup.find(x => x.id == branchId);
      expect(branch).not.toBeUndefined();
    });
  });


  test('Branch Deactivation', ({ given, when, then }) => {
    let activeBranch: BranchContract;
    let branchId: BranchIdContract;

    beforeAll(async () => {
      activeBranch = randomizeBranches(1, { active: true })[0];
    });

    afterAll(async () => {
      await userBuilder.clean();
    });

    given('a branch has been created with active status', async () => {
      branchId = await client(token).create(activeBranch);
    });

    when('the branch is deactivated', async () => {
      await client(token).patch(branchId, { active: false });
    });

    then('the branch has inactive status', async () => {
      const branchFromDb = await client(token).get(branchId) as BranchContract;
      expect(branchFromDb.active).toBeFalsy();
    });

    then('is not available in lookup', async () => {
      const branchLookup = await client(token).lookup();
      const branch = branchLookup.find(x => x.id == branchId);
      expect(branch).toBeUndefined();
    });
  });


});