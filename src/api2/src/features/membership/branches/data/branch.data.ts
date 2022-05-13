import { Address } from "../../../common/address/address.model";
import { Branch } from "../branch.models";
import { Types } from 'mongoose';

const branches = {
  cubaoBranch: new Branch({
    _id: new Types.ObjectId('5f246116fb9e00fefed5bc0d'),
    name: 'Cubao Branch',
    active: true,
    mobile: '0998392403',
    landline: '2345643',
    email: 'cubao@rapide.com',
    address: new Address({
      line1: 'Ocean Street, Virginia Summer Ville',
      line2: 'Mayamot',
      municipality: 'Antipolo City',
      province: 'Rizal'
    })
  }),
  marikinaBranch: new Branch({
    _id: new Types.ObjectId('5f24614fa4bd0f17bb4b6ea9'),
    name: 'Marikina Branch',
    active: true,
    mobile: '0998392403',
    landline: '4325677',
    email: 'marikina@rapide.com',
    address: new Address({
      line1: 'Ocean Street, Virginia Summer Ville',
      line2: 'Mayamot',
      municipality: 'Antipolo City',
      province: 'Rizal'
    })
  })
}

const data = Object.values(branches);

export { branches, data };