import { Gender, Person } from "../../../common/person/person.model";
import { data as branchData, branches } from '../../branches/data/branch.data';

import { Address } from "../../../common/address/address.model";
import { ObjectId } from 'mongodb';
import { User } from "../user.models";
import { config } from "../../../../config";
import { roles } from "../../roles/data/role.data";

const users = {
  superUser: new User({
    _id: new ObjectId('5f23d935e328d5aa255de725'),
    email: config.tenant.superUser.email,
    username: config.tenant.superUser.username,
    password: config.tenant.superUser.password,
    person: new Person({
      firstName: 'Super',
      lastName: 'User',
      gender: Gender.male,
      birthDate: new Date(1982, 3, 28),
    }),
    address: new Address({
      line1: 'Ocean Street, Virginia Summer Ville',
      line2: 'Mayamot',
      municipality: 'Antipolo City',
      province: 'Rizal'
    }),
    branches: branchData.map(x => x._id),
    roles: [roles.superRole._id]
  }),
  adminUser: new User({
    _id: new ObjectId('5f2e48a79737b4749f5605ba'),
    email: 'admin.user@rapide.comm',
    username: 'admin.user',
    password: 'sample',
    person: new Person({
      firstName: 'Admin',
      lastName: 'User',
      gender: Gender.male,
      birthDate: new Date(1982, 3, 28),
    }),
    address: new Address({
      line1: 'Line1',
      line2: 'Line2',
      municipality: 'Antipolo City',
      province: 'Rizal'
    }),
    branches: [branches.cubaoBranch._id],
    roles: [roles.sysAdmin._id]
  }),
  managerUser: new User({
    _id: new ObjectId('5f2e499c682a9c80b15c22ef'),
    email: 'manager.user@rapide.comm',
    username: 'manager.user',
    password: 'sample',
    person: new Person({
      firstName: 'Manager',
      lastName: 'User',
      gender: Gender.male,
      birthDate: new Date(1982, 3, 28),
    }),
    address: new Address({
      line1: 'Line1',
      line2: 'Line2',
      municipality: 'Antipolo City',
      province: 'Rizal'
    }),
    branches: [branches.cubaoBranch._id],
    roles: [roles.manager._id]
  }),
  technicianUser1: new User({
    _id: new ObjectId('5f2e4a5e21b907fa6ca9ab1c'),
    email: 'technician.user@rapide.comm',
    username: 'technician.user',
    password: 'sample',
    person: new Person({
      firstName: 'Technician',
      lastName: 'User',
      gender: Gender.male,
      birthDate: new Date(1982, 3, 28),
    }),
    address: new Address({
      line1: 'Line1',
      line2: 'Line2',
      municipality: 'Antipolo City',
      province: 'Rizal'
    }),
    branches: [branches.cubaoBranch._id],
    roles: [roles.technician._id]
  }),
  technicianUser2: new User({
    _id: new ObjectId('5f326c73dde047c3b8a045ca'),
    email: 'technician2.user@rapide.comm',
    username: 'technician2.user',
    password: 'sample',
    person: new Person({
      firstName: 'Technician2',
      lastName: 'User',
      gender: Gender.male,
      birthDate: new Date(1982, 3, 28),
    }),
    address: new Address({
      line1: 'Line1',
      line2: 'Line2',
      municipality: 'Antipolo City',
      province: 'Rizal'
    }),
    branches: [branches.marikinaBranch._id],
    roles: [roles.technician._id]
  }),
  technicianUser3: new User({
    _id: new ObjectId('5f326c946b0405640ee0257e'),
    email: 'technician3.user@rapide.comm',
    username: 'technician3.user',
    password: 'sample',
    person: new Person({
      firstName: 'Technician3',
      lastName: 'User',
      gender: Gender.male,
      birthDate: new Date(1982, 3, 28),
    }),
    address: new Address({
      line1: 'Line1',
      line2: 'Line2',
      municipality: 'Antipolo City',
      province: 'Rizal'
    }),
    branches: [branches.marikinaBranch._id],
    roles: [roles.technician._id]
  }),
  technicianUser4: new User({
    _id: new ObjectId('5f326cc747cc0649a034d426'),
    email: 'technician4.user@rapide.comm',
    username: 'technician4.user',
    password: 'sample',
    person: new Person({
      firstName: 'Technician4',
      lastName: 'User',
      gender: Gender.male,
      birthDate: new Date(1982, 3, 28),
    }),
    address: new Address({
      line1: 'Line1',
      line2: 'Line2',
      municipality: 'Antipolo City',
      province: 'Rizal'
    }),
    branches: [branches.marikinaBranch._id],
    roles: [roles.technician._id]
  }),
  technicianUser5: new User({
    _id: new ObjectId('5f326ce29347cbf9530c264e'),
    email: 'technician5.user@rapide.comm',
    username: 'technician5.user',
    password: 'sample',
    person: new Person({
      firstName: 'Technician5',
      lastName: 'User',
      gender: Gender.male,
      birthDate: new Date(1982, 3, 28),
    }),
    address: new Address({
      line1: 'Line1',
      line2: 'Line2',
      municipality: 'Antipolo City',
      province: 'Rizal'
    }),
    branches: [branches.marikinaBranch._id],
    roles: [roles.technician._id]
  }),
  technicianUser6: new User({
    _id: new ObjectId('5f326eea13edfbfa5c4224d4'),
    email: 'technician6.user@rapide.comm',
    username: 'technician6.user',
    password: 'sample',
    person: new Person({
      firstName: 'Technician6',
      lastName: 'User',
      gender: Gender.male,
      birthDate: new Date(1982, 3, 28),
    }),
    address: new Address({
      line1: 'Line1',
      line2: 'Line2',
      municipality: 'Antipolo City',
      province: 'Rizal'
    }),
    branches: [branches.cubaoBranch._id],
    roles: [roles.technician._id]
  }),
  technicianUser7: new User({
    _id: new ObjectId('5f326ee463c90c74451ee371'),
    email: 'technician7.user@rapide.comm',
    username: 'technician7.user',
    password: 'sample',
    person: new Person({
      firstName: 'Technician7',
      lastName: 'User',
      gender: Gender.male,
      birthDate: new Date(1982, 3, 28),
    }),
    address: new Address({
      line1: 'Line1',
      line2: 'Line2',
      municipality: 'Antipolo City',
      province: 'Rizal'
    }),
    branches: [branches.cubaoBranch._id],
    roles: [roles.technician._id]
  }),
  partsmanUser: new User({
    _id: new ObjectId('5f2e49e28af9b7c03822a3f1'),
    email: 'partsman.user@rapide.comm',
    username: 'partsman.user',
    password: 'sample',
    person: new Person({
      firstName: 'Partsman',
      lastName: 'User',
      gender: Gender.male,
      birthDate: new Date(1982, 3, 28),
    }),
    address: new Address({
      line1: 'Line1',
      line2: 'Line2',
      municipality: 'Antipolo City',
      province: 'Rizal'
    }),
    branches: [branches.cubaoBranch._id],
    roles: [roles.partsman._id]
  }),
  accounting1User: new User({
    _id: new ObjectId('5f2e4a4b41c20b07660ddbca'),
    email: 'accounting1.user@rapide.comm',
    username: 'accounting1.user',
    password: 'sample',
    person: new Person({
      firstName: 'Accounting1',
      lastName: 'User',
      gender: Gender.male,
      birthDate: new Date(1982, 3, 28),
    }),
    address: new Address({
      line1: 'Line1',
      line2: 'Line2',
      municipality: 'Antipolo City',
      province: 'Rizal'
    }),
    branches: [branches.cubaoBranch._id],
    roles: [roles.accounting1._id]
  }),
  accounting2User: new User({
    _id: new ObjectId('5f2e4a401576914931e4f544'),
    email: 'accounting2.user@rapide.comm',
    username: 'accounting2.user',
    password: 'sample',
    person: new Person({
      firstName: 'Accounting2',
      lastName: 'User',
      gender: Gender.male,
      birthDate: new Date(1982, 3, 28),
    }),
    address: new Address({
      line1: 'Line1',
      line2: 'Line2',
      municipality: 'Antipolo City',
      province: 'Rizal'
    }),
    branches: [branches.cubaoBranch._id],
    roles: [roles.accounting2._id]
  })
}

const data = Object.values(users);

export { users, data };