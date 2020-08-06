import { Branch } from "./branch.models";
import { ValidationRules } from "aurelia-validation";

const branchRules = ValidationRules
  .ensure((branch: Branch) => branch.name).required()
  // .ensure((branch: Branch) => branch.active).required()
  // .ensure((branch: Branch) => branch.mobile).required()
  // .ensure((branch: Branch) => branch.landline).required()
  .ensure((branch: Branch) => branch.email).email()
  // .ensure((branch: Branch) => branch.address).required()
  .rules;

export { branchRules }