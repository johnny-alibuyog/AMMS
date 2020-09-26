import { Resource, ResourceGroup } from "../resource.model";

import { ObjectId } from 'mongodb';

const resources = {
  all: new Resource({
    _id: new ObjectId('5f342b3d25f7abf68023dce5'),
    group: ResourceGroup.all,
    name: 'All'
  }),
  common: {
    image: new Resource({
      _id: new ObjectId('5f32ac3695d5fce5d9ea9890'),
      group: ResourceGroup.common,
      name: 'Images'
    })
  },
  membership: {
    tenant: new Resource({
      _id: new ObjectId('5f32ac4cb26a820612423650'),
      group: ResourceGroup.membership,
      name: 'Tenants'
    }),
    tenantUserSettings: new Resource({
      _id: new ObjectId('5f32c5f6fe8a69c707d95ded'),
      group: ResourceGroup.membership,
      name: 'Tenant User Settings'
    }),
    branch: new Resource({
      _id: new ObjectId('5f32c60651e325edb7f5a764'),
      group: ResourceGroup.membership,
      name: 'Branches'
    }),
    role: new Resource({
      _id: new ObjectId('5f32c60c9a98e34058ffd032'),
      group: ResourceGroup.membership,
      name: 'Roles'
    }),
    user: new Resource({
      _id: new ObjectId('5f32c61253c0586450d96d49'),
      group: ResourceGroup.membership,
      name: 'Users'
    }),
    userPassword: new Resource({
      _id: new ObjectId('5f32c61949be52320b58b550'),
      group: ResourceGroup.membership,
      name: 'Password'
    }),
  }
};

const flatten = (obj: Object) => {
  if (obj instanceof Resource) {
    return [obj];
  }
  const resources: Resource[] = [];
  const vals = Object.values(obj);
  vals.forEach(val => {
    if (val instanceof Resource) {
      resources.push(val)
    }
    else {
      resources.push(...flatten(val));
    }
  });
  return resources;
}

const data = flatten(resources);

export { resources, data }


