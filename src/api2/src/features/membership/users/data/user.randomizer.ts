import * as faker from 'faker';

import { Person } from '../../../common/person/person.model';
import { Role } from '../../roles/role.models';
import { User } from '../user.models';
import { randomAddress } from '../../../common/address/address.seed';
import { randomPerson } from '../../../common/person/person.seed';

const generateUsername = (person: Person) => faker.internet.userName(person.firstName, person.lastName); 

const randomizeUsersFn = (getRoles: () => Role[]) => (count: number = 12) => {

  return Array.from({ length: count }, (x, i) => {
    const person = randomPerson();

    return new User({
      email: faker.internet.email(person.firstName, person.lastName),
      username: generateUsername(person),
      password: faker.internet.password(),
      person: person,
      address: randomAddress(),
      roles: getRoles()
    })
  });
};

export { randomizeUsersFn }