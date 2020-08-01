import { Person } from "./person.model";
import { ValidationRules } from "aurelia-validation";

const personRules = ValidationRules
  .ensure((person: Person) => person.firstName).required()
  .ensure((person: Person) => person.lastName).required()
  .ensure((person: Person) => person.gender).required()
  .rules;

export { personRules }