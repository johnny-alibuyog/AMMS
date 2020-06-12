
// https://psa.gov.ph/classification/psgc/downloads/PSGC%20Publication%20March2020.xlsx

import { ValueObject } from "..";
import { prop } from "@typegoose/typegoose";

// https://psa.gov.ph/classification/psgc/
class Address extends ValueObject {
  // @prop()
  // public unit?: string;         // Unit Number + House/Building/Street Number

  // @prop()
  // public street?: string;       // Street Name

  // @prop()
  // public subdivision?: string;  // Subdivision/Village

  // @prop()
  // public district?: string;     // Barangay/District Name

  @prop()
  public line1?: string;        // Unit Number + House/Building/Street Number, Street Name

  @prop()
  public line2?: string;        // Subdivision/Village, Barangay/District Name

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

export { Address }