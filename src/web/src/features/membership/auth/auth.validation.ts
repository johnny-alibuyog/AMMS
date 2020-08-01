import { LoginCredential } from "./auth.models";
import { ValidationRules } from "aurelia-validation";

const credentialRules = ValidationRules
  .ensure((x: LoginCredential) => x.username).required()
  .ensure((x: LoginCredential) => x.password).required()
  .rules;

export { credentialRules }