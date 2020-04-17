import { ValueObject, Entity } from '../../kernel';
import { prop, mapProp, index } from "@typegoose/typegoose";

enum Resource {
  all = 'All',
  membership_tenant = 'Membership:Tenants',
  membership_tenant_user_settings = 'Membership:Tenants.Users.Settings',
  membership_branch = 'Membership:Branches',
  membership_role = 'Membership:Role',
  membership_user = 'Membership:Users',
  membership_user_password = 'Membership:Users.Password',
}

enum Action {
  all = 'All',
  read = 'Read',
  create = 'Create',
  update = 'Update',
  delete = 'Delete',
}

enum Ownership {
  own = 'Own',
  managed = 'Managed',
  any = 'Any'
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
  @prop({ enum: Resource, required: true })
  public resource!: Resource;

  @prop()
  public permissions!: Permission[];

  // @mapProp({ of: Action, enum: Ownership, required: true })
  // public permissions!: Map<Action, Ownership>;

  constructor(init?: AccessControl) {
    super();
    Object.assign(this, init);
  }
}

@index({ name: 1, accessControl: 1 }, { unique: true })
class Role extends Entity {
  @prop({ required: true })
  public name!: string;

  @prop()
  public accessControls!: AccessControl[];

  constructor(init?: Role) {
    super();
    Object.assign(this, init);
  }
}

const roles = {
  super: new Role({
    name: 'Super Role',
    accessControls: [
      new AccessControl({
        resource: Resource.all,
        permissions: [
          new Permission({
            action: Action.all,
            ownership: Ownership.any
          })
        ]
      })
    ]
  })
};

export {
  roles,
  Role,
  AccessControl,
  Resource,
  Permission,
  Action,
  Ownership,
}