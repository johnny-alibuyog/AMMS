import { User } from "./user.models";
import { ValidationRules } from "aurelia-validation";

const userRules = ValidationRules
  .ensure((user: User) => user.username).required()
  .ensure((user: User) => user.email).required().email()
  // .ensure('person.firstName').required()
  // .ensure('person.lastName').required()
  // .ensure((user: User) => user.password).required()
  // .ensure((user: User) => user.confirmPassword).required().satisfiesRule(rules.matchesProperty, 'password')
  // .ensure((user: User) => user.addressInfo).required()
  // .ensure((user: User) => user.roles).required()
  .rules;

export { userRules }