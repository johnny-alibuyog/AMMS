import { ValueObject, Entity } from '../../kernel';
import { prop, Ref, arrayProp, pre, post } from '@typegoose/typegoose';
import { Role } from './../roles/role.models';
import { encryptor } from '../../../utils/encryptor';
import { IModelOptions } from '@typegoose/typegoose/lib/types';

enum Gender {
  male = 'Male',
  female = 'Female',
  others = 'Others'
}

class Person extends ValueObject {
  @prop({ required: true })
  public firstName!: string;

  @prop()
  public middleName?: string;

  @prop({ required: true })
  public lastName!: string;

  @prop({ required: true })
  public gender!: Gender;

  @prop()
  public birthDate?: Date;

  constructor(init?: Person) {
    super();
    Object.assign(this, init);
  }
}

class Address extends ValueObject {
  @prop()
  public unit?: string;         // Unit Number + House/Building/Street Number

  @prop()
  public street?: string;       // Street Name

  @prop()
  public subdivision?: string;  // Subdivision/Village

  @prop()
  public district?: string;     // Barangay/District Name

  @prop()
  public municipality?: string; // City/Municipality

  @prop()
  public province?: string;     // Province/Metro Manila

  @prop()
  public country?: string;

  @prop()
  public zipcode?: string;

  constructor(init?: Address) {
    super();
    Object.assign(this, init);
  }
}

@pre<User>('save', async function () {
  if (this.password) {
    this.password = await encryptor.encrypt(this.password);
  }
}) 
class User extends Entity {
  @prop({ unique: true, required: true })
  public username!: string;

  @prop()
  public password?: string;

  @prop({ _id: false, required: true })
  public person!: Person;

  @prop()
  public addressInfo?: Address[];

  @arrayProp({ itemsRef: Role, required: true })
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
  Gender,
  Person,
  Address,
  User,
  userModelOptions
}
