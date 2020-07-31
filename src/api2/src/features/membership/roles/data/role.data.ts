import { AccessControl, Action, Ownership, Permission, Resource, Role } from "../role.models";

import { ObjectId } from 'mongodb';
import { config } from "../../../../config";

const roles = {

  superRole: new Role({
    _id: new ObjectId('5f23d6a506fd041e7fc210d3'),
    name: config.tenant.superRole.name,
    accessControls: [
      new AccessControl({
        resource: Resource.all,
        permissions: [
          new Permission({
            action: Action.all,
            ownership: Ownership.all
          })
        ]
      })
    ]
  }),

  sysAdmin: new Role({
    _id: new ObjectId('5f23d862280be05226e556e1'),
    name: 'SysAdmin',
    accessControls: [
      new AccessControl({
        resource: Resource.all,
        permissions: [
          new Permission({
            action: Action.all,
            ownership: Ownership.all
          })
        ]
      })
    ]
  }),

  manager: new Role({
    _id: new ObjectId('5f23d878fdb967f538a2fe13'),
    name: 'Manager',
    accessControls: [
      new AccessControl({
        resource: Resource.all,
        permissions: [
          new Permission({
            action: Action.all,
            ownership: Ownership.all
          })
        ]
      })
    ]
  }),

  technician: new Role({
    _id: new ObjectId('5f23d87e00799b9e229a57b6'),
    name: 'Technician',
    accessControls: [
      new AccessControl({
        resource: Resource.all,
        permissions: [
          new Permission({
            action: Action.all,
            ownership: Ownership.all
          })
        ]
      })
    ]
  }),

  partsman: new Role({
    _id: new ObjectId('5f23d8883845e2fee41f4625'),
    name: 'Partsman',
    accessControls: [
      new AccessControl({
        resource: Resource.all,
        permissions: [
          new Permission({
            action: Action.all,
            ownership: Ownership.all
          })
        ]
      })
    ]
  }),

  accounting1: new Role({
    _id: new ObjectId('5f23d88df3ad56faa11a233b'),
    name: 'Accounting 1',
    accessControls: [
      new AccessControl({
        resource: Resource.all,
        permissions: [
          new Permission({
            action: Action.all,
            ownership: Ownership.all
          })
        ]
      })
    ]
  }),

  accounting2: new Role({
    _id: new ObjectId('5f23d8953f0413c612e3bd63'),
    name: 'Accounting 2',
    accessControls: [
      new AccessControl({
        resource: Resource.all,
        permissions: [
          new Permission({ action: Action.all, ownership: Ownership.all }),
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

