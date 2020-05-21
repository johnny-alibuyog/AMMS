import * as faker from 'faker';
import { User, Person, Gender, Address } from './user.models';
import { Role } from '../roles/role.models';

const randomGender = () => faker.random.arrayElement(Object.values(Gender));

const randomPersonFn = (getGender: () => Gender) => () => {
  const gender = getGender();
  const g = (gender === Gender.male) ? 1 : 0;
  return new Person({
    firstName: faker.name.firstName(g),
    middleName: faker.name.lastName(g),
    lastName: faker.name.lastName(g),
    gender: gender,
    birthDate: faker.date.past(
      faker.random.number({
        min: 19,
        max: 60
      })
    )
  });
};

const randomAddress = () => {
  return new Address({
    unit: faker.address.streetPrefix(),
    street: faker.address.streetName(),
    subdivision: faker.address.streetSuffix(),
    district: faker.address.state(),
    municipality: faker.address.city(),
    province: faker.address.city(),
    country: faker.address.country(),
    zipcode: faker.address.countryCode()
  });
}

const generateUsername = (person: Person) => faker.internet.userName(person.firstName, person.lastName); 

const randomUsersFn = (getRoles: () => Role[]) => (count: number = 12) => {
  const randomPerson = randomPersonFn(randomGender);

  return Array.from({ length: count }, (x, i) => {
    const person = randomPerson();

    return new User({
      email: faker.internet.email(person.firstName, person.lastName),
      username: generateUsername(person),
      password: faker.internet.password(),
      person: person,
      addressInfo: [randomAddress()],
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