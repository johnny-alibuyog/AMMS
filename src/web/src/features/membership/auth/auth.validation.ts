import { SigninCredential } from "./auth.models";
import { ValidationRules } from "aurelia-validation";

const credentialRules = ValidationRules
  .ensure((x: SigninCredential) => x.username).required()
  .ensure((x: SigninCredential) => x.password).required()
  .rules;

export { credentialRules }