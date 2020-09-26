import { ObjectId } from "mongodb";
import { Ref } from "@typegoose/typegoose";

abstract class Entity {
  public _id?: ObjectId;

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

const getObjectId = (value: Ref<Entity>): ObjectId =>  {
  if (value instanceof Entity && value._id) {
    return value._id;
  }
  else {
    return value as ObjectId;
  }
}

export {
  Entity,
  ValueObject,
  getObjectId,
  functor,
}


