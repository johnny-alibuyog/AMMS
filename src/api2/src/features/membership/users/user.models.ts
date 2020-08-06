import { Ref, pre, prop } from '@typegoose/typegoose';

import { Address } from '../../common/address/address.model';
import { Branch } from '../branches/branch.models';
import { Entity } from '../../common/kernel';
import { IModelOptions } from '@typegoose/typegoose/lib/types';
import { Image } from '../../common/images/image.models';
import { Person } from '../../common/person/person.model';
import { Role } from './../roles/role.models';
import { encryptor } from '../../../utils/encryptor';

const preUserSave = async (user: User) => {
  if (user.password) {
    user.password = await encryptor.encrypt(user.password);
  }
}

@pre<User>('save', async function () { await preUserSave(this) })
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

  @prop({ ref: () => Branch })
  public branches!: Ref<Branch>[];

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
  preUserSave,
  userModelOptions
}
