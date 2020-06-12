import { ValueObject } from "..";
import { prop } from "@typegoose/typegoose";

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

export {
  Gender,
  Person
}