import * as faker from 'faker';

import { Gender, Person } from '../person.model';

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

const randomPerson = randomPersonFn(randomGender);

export { randomPerson }