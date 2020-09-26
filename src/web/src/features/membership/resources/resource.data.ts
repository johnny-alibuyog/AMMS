import { Resource, ResourceGroup } from "./resource.model";

type ResourceType = {
  all: Resource,
  common: {
    image: Resource
  },
  membership: {
    tenant: Resource,
    tenantUserSettings: Resource,
    branch: Resource,
    role: Resource,
    user: Resource,
    userPassword: Resource,
  },
  sales: {
    salesOrder: Resource,
    salesInvoice: Resource,
    payments: Resource,
    collectibles: Resource,
  },
  purchasing: {
    purchaseOrder: Resource,
    voucher: Resource,
    returns: Resource,
    vendors: Resource,
    payables: Resource
  }
}

const resources: ResourceType = {
  all: {
    id: '5f342b3d25f7abf68023dce5',
    group: ResourceGroup.all,
    name: 'All'
  },
  common: {
    image: {
      id: '5f32ac3695d5fce5d9ea9890',
      group: ResourceGroup.common,
      name: 'Images'
    },
  },
  membership: {
    tenant: {
      id: '5f32ac4cb26a820612423650',
      group: ResourceGroup.membership,
      name: 'Tenants'
    },
    tenantUserSettings: {
      id: '5f32c5f6fe8a69c707d95ded',
      group: ResourceGroup.membership,
      name: 'User Settings'
    },
    branch: {
      id: '5f32c60651e325edb7f5a764',
      group: ResourceGroup.membership,
      name: 'Branches'
    },
    role: {
      id: '5f32c60c9a98e34058ffd032',
      group: ResourceGroup.membership,
      name: 'Roles'
    },
    user: {
      id: '5f32c61253c0586450d96d49',
      group: ResourceGroup.membership,
      name: 'Users'
    },
    userPassword: {
      id: '5f32c61949be52320b58b550',
      group: ResourceGroup.membership,
      name: 'Password'
    },
  },
  sales: {
    salesOrder: {
      id: '5f4bd9797b9da204955650ea',
      group: ResourceGroup.sales,
      name: 'Sales Order'
    },
    salesInvoice: {
      id: '5f4bd98336c259b671662e30',
      group: ResourceGroup.sales,
      name: 'Sales Invoice'
    },
    payments: {
      id: '5f4bd986f6c03b40cc94d468',
      group: ResourceGroup.sales,
      name: 'Payments'
    },
    collectibles: {
      id: '5f4bd98a2dd698018a5116f2',
      group: ResourceGroup.sales,
      name: 'Collectibles'
    },
  },
  purchasing: {
    purchaseOrder: {
      id: '5f4bd9a8cb04efe77adce7c8',
      group: ResourceGroup.purchasing,
      name: 'Purchase Order'
    },
    voucher: {
      id: '5f4bd9abe7b5ad76c4559eb7',
      group: ResourceGroup.purchasing,
      name: 'Voucher'
    },
    returns: {
      id: '5f4bd9af145f580dc4e7d9da',
      group: ResourceGroup.purchasing,
      name: 'Returns'
    },
    vendors: {
      id: '5f4bd9b3d1b205a4e1bf921a',
      group: ResourceGroup.purchasing,
      name: 'Vendors'
    },
    payables: {
      id: '5f4bd9b7d7a30ca8b187eb44',
      group: ResourceGroup.purchasing,
      name: 'Payables'
    }
  }
};

const fieldExistsFn = <T>(obj: Object) => (field: keyof T) => obj[field.toString()] !== undefined;

const isResource = (obj: Object) => {
  const fieldExists = fieldExistsFn<Resource>(obj);
  return fieldExists('id') && fieldExists('name') && fieldExists('group');
}

const flatten = (obj: Object) => {
  if (isResource(obj)) {
    return [obj as Resource];
  }
  const resources: Resource[] = [];
  const vals = Object.values(obj);
  vals.forEach(val => {
    if (isResource(val)) {
      resources.push(val)
    }
    else {
      resources.push(...flatten(val));
    }
  });
  return resources;
}

const data = flatten(resources).filter(x =>
  x.id !== resources.all.id ||
  x.group !== ResourceGroup.all
);

export { resources, data }


