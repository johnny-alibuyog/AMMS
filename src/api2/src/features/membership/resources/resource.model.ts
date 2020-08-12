import { Entity } from "../../common/kernel";
import { prop } from "@typegoose/typegoose";

enum ResourceGroup {
  all = 'All',
  common = 'Common',
  membership = 'Membership',
  services = 'Services',
  sales = 'Sales',
  inventory = 'Inventory',
  purchasing = 'Purchasing',
}


class Resource extends Entity  {
  @prop({ required: true })
  public name!: string;

  @prop({ enum: ResourceGroup, required: true })
  public group!: ResourceGroup;

  constructor(init?: Resource) {
    super();
    Object.assign(this, init);
  }
}

export {
  Resource,
  ResourceGroup,
}