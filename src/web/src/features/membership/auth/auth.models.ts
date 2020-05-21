import { ValidationRules } from 'aurelia-validation';

type LoginCredential = {
  username: string,
  password: string,
  remember: boolean
}

type LoginResponse = {
  token: string
}

const credentialRules = ValidationRules
  .ensure((x: LoginCredential) => x.username).required()
  .ensure((x: LoginCredential) => x.password).required()
  .rules;


const intitCredential = () : LoginCredential => ({
  username: '',
  password: '',
  remember: false
})

export {
  LoginResponse,
  LoginCredential,
  intitCredential,
  credentialRules
}
