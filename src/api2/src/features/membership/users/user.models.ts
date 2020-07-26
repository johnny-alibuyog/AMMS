import { Ref, arrayProp, post, pre, prop } from '@typegoose/typegoose';

import { Address } from '../../common/address/address.model';
import { Entity } from '../../common/kernel';
import { IModelOptions } from '@typegoose/typegoose/lib/types';
import { Image } from '../../common/images/image.models';
import { Person } from '../../common/person/person.model';
import { Role } from './../roles/role.models';
import { encryptor } from '../../../utils/encryptor';

@pre<User>('save', async function () {
  if (this.password) {
    this.password = await encryptor.encrypt(this.password);
  }
})
class User extends Entity {
  @prop({ unique: true, required: true })
  public email!: string;

  @prop({ unique: true, required: true })
  public username!: string;

  @prop()
  public password?: string;

  @prop({ _id: false, required: true })
  public person!: Person;

  @prop({ _id: false })
  public address?: Address;

  @prop({ ref: () => Image })
  public photo?: Ref<Image>;

  @prop({ ref: () => Role })
  public roles!: Ref<Role>[];

  constructor(init?: User) {
    super();
    Object.assign(this, init);
  }
}

const userModelOptions: IModelOptions = {
  schemaOptions: {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret, options) => {
        // ret['id'] = ret['_id'];
        // delete ret['_id'];
        // delete ret['__v'];
        delete ret['password'];
        return ret;
      }
    }
  }
};

export {
  User,
  userModelOptions
}
