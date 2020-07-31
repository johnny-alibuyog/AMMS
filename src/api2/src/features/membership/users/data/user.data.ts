import { Gender, Person } from "../../../common/person/person.model";

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
    roles: [roles.superRole._id]
  })
}

const data = Object.values(users);

export { users, data };