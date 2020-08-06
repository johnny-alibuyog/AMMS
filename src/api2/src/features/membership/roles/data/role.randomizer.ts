import * as faker from 'faker';

import { AccessControl, Action, Ownership, Permission, Resource, Role } from '../role.models';
import { randomizeElementFn, randomizeElementsFn } from '../../../common/tests/helpers';

const resources = Object.values(Resource).filter(x => x != Resource.all);

const actions = Object.values(Action);

const ownerships = Object.values(Ownership);

const randomizePermissionFn = (
  getActions: () => Action[],
  getOwnership: () => Ownership) => {
  return () => {
    return getActions()
      .map(x =>
        new Permission({
          action: x,
          ownership: getOwnership()
        })
      );
    // return new Map(
    //   getActions().map(x => [x, getOwnership()])
    // )
  }
}

const randomizeAccessControlsFn = (
  getResource: () => Resource[],
  getPermissions: () => Permission[]) => {
  return () => {
    return getResource()
      .map((x, i) =>
        new AccessControl({
          resource: x,
          permissions: getPermissions()
        })
      );
  };
};

const randomizeAccessControls = randomizeAccessControlsFn(
  randomizeElementsFn(resources),
  randomizePermissionFn(
    randomizeElementsFn(actions),
    randomizeElementFn(ownerships)
  )
);

const randomizeRoles = (count: number = 12) => {
  return Array.from({ length: count },
    (x, i) => new Role({
      name: faker.name.jobTitle(),
      active: faker.random.boolean(),
      accessControls: randomizeAccessControls()
    })
  );
};

export {
  randomizeRoles
};