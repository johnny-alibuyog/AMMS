import { bindable } from "aurelia-framework";
import { Property } from "./property-page";

export class PropertyCard {
  @bindable()
  public property: Property;
}
