import { Ref, pre, prop } from '@typegoose/typegoose';

import { Address } from '../../common/address/address.model';
import { Entity } from '../../common/kernel';

class Branch extends Entity {
  @prop({ required: true })
  public name!: string;

  @prop()
  public active!: boolean;

  @prop()
  public mobile?: string;

  @prop()
  public landline?: string;

  @prop()
  public email?: string;

  @prop({ _id: false })
  public address?: Address;

  constructor(init?: Branch) {
    super();
    Object.assign(this, init);
  }
}

export { Branch }
