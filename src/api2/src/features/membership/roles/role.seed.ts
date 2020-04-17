import * as faker from 'faker';
import { Role, AccessControl, Resource, Permission, Action, Ownership } from './role.models';

const resources = Object.values(Resource).filter(x => x != Resource.all);

const actions = Object.values(Action);

const ownerships = Object.values(Ownership);

const randomElementsFn = <T>(elements: T[]) => () => faker.helpers.shuffle(elements).slice(0, faker.random.number({ min: 1, max: elements.length }))

const randomElementFn = <T>(elements: T[]) => () => faker.random.arrayElement(ownerships);

const randomPermission2Fn = (
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

const randomAccessControlsFn = (
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

const randomAccessControls = randomAccessControlsFn(
  randomElementsFn(resources),
  randomPermission2Fn(
    randomElementsFn(actions),
    randomElementFn(ownerships)
  )
);

const randomRoles = (count: number = 12) => {
  return Array.from({ length: count },
    (x, i) => new Role({
      name: faker.name.jobTitle(),
      accessControls: randomAccessControls()
    })
  );
};

const defaultRoles = () => {

};

export const roleSeed = {
  randomRoles,
  defaultRoles
};