import { AccessControl, Action, Permission, Role } from "../role.models";

import { ObjectId } from 'mongodb';
import { Ownership } from "../../../common/ownership/ownership.model";
import { config } from "../../../../config";
import { resources } from "../../resources/data/resource.data";

const roles = {

  superRole: new Role({
    _id: new ObjectId('5f23d6a506fd041e7fc210d3'),
    active: true,
    name: config.tenant.superRole.name,
    description: config.tenant.superRole.name,
    accessControls: [
      new AccessControl({
        resource: resources.all._id,
        permissions: [
          new Permission({ action: Action.all, ownership: Ownership.all })
        ]
      })
    ]
  }),

  sysAdmin: new Role({
    _id: new ObjectId('5f23d862280be05226e556e1'),
    active: true,
    name: 'SysAdmin',
    description: 'System Administrator',
    accessControls: [
      new AccessControl({
        resource: resources.common.image._id,
        permissions: [
          new Permission({ action: Action.read, ownership: Ownership.all }),
          new Permission({ action: Action.create, ownership: Ownership.all }),
          new Permission({ action: Action.update, ownership: Ownership.all }),
          new Permission({ action: Action.delete, ownership: Ownership.all }),
        ]
      }),
      new AccessControl({
        resource: resources.membership.tenant._id,
        permissions: [
          new Permission({ action: Action.read, ownership: Ownership.all }),
          new Permission({ action: Action.create, ownership: Ownership.all }),
          new Permission({ action: Action.update, ownership: Ownership.all }),
          new Permission({ action: Action.delete, ownership: Ownership.all }),
        ]
      }),
      new AccessControl({
        resource: resources.membership.tenantUserSettings._id,
        permissions: [
          new Permission({ action: Action.read, ownership: Ownership.all }),
          new Permission({ action: Action.create, ownership: Ownership.all }),
          new Permission({ action: Action.update, ownership: Ownership.all }),
          new Permission({ action: Action.delete, ownership: Ownership.all }),
        ]
      }),
      new AccessControl({
        resource: resources.membership.branch._id,
        permissions: [
          new Permission({ action: Action.read, ownership: Ownership.all }),
          new Permission({ action: Action.create, ownership: Ownership.all }),
          new Permission({ action: Action.update, ownership: Ownership.all }),
          new Permission({ action: Action.delete, ownership: Ownership.all }),
        ]
      }),
      new AccessControl({
        resource: resources.membership.role._id,
        permissions: [
          new Permission({ action: Action.read, ownership: Ownership.all }),
          new Permission({ action: Action.create, ownership: Ownership.all }),
          new Permission({ action: Action.update, ownership: Ownership.all }),
          new Permission({ action: Action.delete, ownership: Ownership.all }),
        ]
      }),
      new AccessControl({
        resource: resources.membership.user._id,
        permissions: [
          new Permission({ action: Action.read, ownership: Ownership.all }),
          new Permission({ action: Action.create, ownership: Ownership.all }),
          new Permission({ action: Action.update, ownership: Ownership.all }),
          new Permission({ action: Action.delete, ownership: Ownership.all }),
        ]
      }),
      new AccessControl({ 
        resource: resources.membership.userPassword._id,
        permissions: [
          new Permission({ action: Action.read, ownership: Ownership.all }),
          new Permission({ action: Action.create, ownership: Ownership.all }),
          new Permission({ action: Action.update, ownership: Ownership.all }),
          new Permission({ action: Action.delete, ownership: Ownership.all }),
        ]
      }),
    ]
  }),

  manager: new Role({
    _id: new ObjectId('5f23d878fdb967f538a2fe13'),
    active: true,
    name: 'Manager',
    description: 'Manager',
    accessControls: [
      new AccessControl({
        resource: resources.all._id,
        permissions: [
          new Permission({ action: Action.all, ownership: Ownership.all })
        ]
      })
    ]
  }),

  technician: new Role({
    _id: new ObjectId('5f23d87e00799b9e229a57b6'),
    active: true,
    name: 'Technician',
    description: 'Technician',
    accessControls: [
      new AccessControl({
        resource: resources.all._id,
        permissions: [
          new Permission({ action: Action.all, ownership: Ownership.all })
        ]
      })
    ]
  }),

  partsman: new Role({
    _id: new ObjectId('5f23d8883845e2fee41f4625'),
    active: true,
    name: 'Partsman',
    description: 'Partsman',
    accessControls: [
      new AccessControl({
        resource: resources.all._id,
        permissions: [
          new Permission({ action: Action.all, ownership: Ownership.all })
        ]
      })
    ]
  }),

  accounting1: new Role({
    _id: new ObjectId('5f23d88df3ad56faa11a233b'),
    active: true,
    name: 'Accounting 1',
    description: 'Accounting 1',
    accessControls: [
      new AccessControl({
        resource: resources.all._id,
        permissions: [
          new Permission({ action: Action.all, ownership: Ownership.all })
        ]
      })
    ]
  }),

  accounting2: new Role({
    _id: new ObjectId('5f23d8953f0413c612e3bd63'),
    name: 'Accounting 2',
    description: 'Accounting 2',
    active: true,
    accessControls: [
      new AccessControl({
        resource: resources.all._id,
        permissions: [
          new Permission({ action: Action.read, ownership: Ownership.all }),
          new Permission({ action: Action.create, ownership: Ownership.all }),
          new Permission({ action: Action.update, ownership: Ownership.all }),
          new Permission({ action: Action.delete, ownership: Ownership.all }),]
      })
    ]
  })

};

const data = Object.values(roles);

export { roles, data }

