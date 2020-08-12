import { Role } from "./role.models";
import { ValidationRules } from "aurelia-validation";

const roleRules = ValidationRules
  .ensure((x: Role) => x.name).required()
  .ensure((x: Role) => x.description).required()
  .rules;

export { roleRules }