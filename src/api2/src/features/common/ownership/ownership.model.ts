import { Branch } from "../../membership/branches/branch.models"
import { Ref } from "@typegoose/typegoose";
import { User } from "../../membership/users/user.models";

interface IOwnable {
  ownedBy?: Ref<User>,
  managedBy?: Ref<User>,
  branches: Ref<Branch>[]
}

enum Ownership {
  none = 'None',
  owned = 'Owned',
  managed = 'Managed',
  all = 'All'
}

export { IOwnable, Ownership }