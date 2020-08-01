import * as faker from 'faker';

import { Branch } from '../branch.models';
import { randomAddress } from '../../../common/address/address.seed';

const randomizeBranches = (count: number = 12) => {
  return Array.from({ length: count }, (x, i) => {
    return new Branch({
      name: faker.company.companyName(),
      active: faker.random.boolean(),
      email: faker.internet.email(),
      landline: faker.phone.phoneNumber(),
      mobile: faker.phone.phoneNumber(),
      address: randomAddress(),
    })
  });
};

export { randomizeBranches }