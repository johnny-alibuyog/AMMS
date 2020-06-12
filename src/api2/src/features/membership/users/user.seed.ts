import * as faker from 'faker';
import { User } from './user.models';
import { Role } from '../roles/role.models';
import { Person } from '../../common/person/person.model';
import { randomPerson } from '../../common/person/person.seed';
import { randomAddress } from '../../common/address/address.seed';

const generateUsername = (person: Person) => faker.internet.userName(person.firstName, person.lastName); 

const randomUsersFn = (getRoles: () => Role[]) => (count: number = 12) => {

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

const defaultUsers = () => {

};

export const userSeed = {
  randomUsersFn,
  defaultUsers
};