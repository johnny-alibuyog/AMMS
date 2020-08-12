import * as faker from 'faker';

import { AccessControl, Action, Permission, Role } from '../role.models';
import { randomizeElementFn, randomizeElementsFn } from '../../../common/helpers/test.helpers';

import { Ownership } from "../../../common/ownership/ownership.model";
import { Resource } from '../../resources/resource.model';
import { data as resources } from '../../resources/data/resource.data';

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
  // getResource: () => Resource[],
  getResource1: () => Resource[],
  getPermissions: () => Permission[]) => {
  return () => {
    return getResource1()
      .map((x, i) =>
        new AccessControl({
          resource: x._id,
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