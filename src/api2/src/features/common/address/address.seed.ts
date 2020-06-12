import * as faker from 'faker';
import { Address } from './address.model';

const randomAddress = () => {
  return new Address({
    // unit: faker.address.streetPrefix(),
    // street: faker.address.streetName(),
    // subdivision: faker.address.streetSuffix(),
    // district: faker.address.state(),
    line1: faker.address.streetAddress(true),
    line2: faker.address.secondaryAddress(),
    municipality: faker.address.city(),
    province: faker.address.city(),
    country: faker.address.country(),
    zipcode: faker.address.countryCode()
  });
}

export { randomAddress }