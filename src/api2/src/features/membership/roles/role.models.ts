import { Entity, ValueObject } from '../../common/kernel';
import { Ref, prop } from "@typegoose/typegoose";

import { Ownership } from '../../common/ownership/ownership.model';
import { Resource } from '../resources/resource.model';

enum Action {
  all = 'All',
  read = 'Read',
  create = 'Create',
  update = 'Update',
  delete = 'Delete',
}

class Permission extends ValueObject {
  @prop({ enum: Action, required: true })
  public action!: Action;

  @prop({ enum: Ownership, required: true })
  public ownership!: Ownership;

  constructor(init?: Permission) {
    super();
    Object.assign(this, init);
  }
}

class AccessControl extends ValueObject {
  @prop({ ref: () => Resource })
  public resource!: Ref<Resource>;

  @prop({ _id: false, type: () => Permission})
  public permissions!: Permission[];

  constructor(init?: AccessControl) {
    super();
    Object.assign(this, init);
  }
}

// @index({ name: 1, accessControl: 1 }, { unique: true })
class Role extends Entity {
  @prop({ required: true })
  public name!: string;

  @prop()
  public description?: string;

  @prop()
  public active!: boolean;

  @prop({  _id: false, type: () => AccessControl})
  public accessControls!: AccessControl[];

  constructor(init?: Role) {
    super();
    Object.assign(this, init);
  }
}

export {
  Role,
  AccessControl,
  Permission,
  Action
}