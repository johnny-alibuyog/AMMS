import { Ref } from "@typegoose/typegoose";
import { Types } from "mongoose";

abstract class Entity {
  public _id?: Types.ObjectId;

  public id?: string = '';

  constructor() { }
}

class ValueObject {
  constructor() { }
}

type Mappable<T> = {
  map: <R>(fn: (x: T) => R) => Mappable<R>;
  valueOf: () => T;
}

const functor = <T>(value: T): Mappable<T> => ({
  map: <R>(fn: (x: T) => R): Mappable<R> => functor(fn(value)),
  valueOf: () => value,
});

const getObjectId = (value: Ref<Entity, Types.ObjectId | undefined>): Types.ObjectId =>  {
  return value?._id ?? value as Types.ObjectId;

  // if (value instanceof Entity && value?._id) {
  //   return value?._id;
  // }
  // else {
  //   return value as Types.ObjectId;
  // }
}

export {
  Entity,
  ValueObject,
  getObjectId,
  functor,
}


