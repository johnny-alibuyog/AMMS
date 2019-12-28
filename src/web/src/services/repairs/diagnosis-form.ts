import { autoinject } from 'aurelia-framework';
import { ValidationRules, ValidationControllerFactory, ValidationController, ValidateResult } from 'aurelia-validation';

@autoinject()
export class DiagnosisForm {
  public title: string = 'Diagnosis';
  public user: User = <User>{};
  public readonly controller: ValidationController;
  public readonly errors: ValidateResult[] = [];

  constructor(factory: ValidationControllerFactory) {
    this.controller = factory.createForCurrentScope();
    this.controller.addObject(this.user, userRules);
  }

  public async submit() : Promise<void> {
    debugger;
    console.log(this.errors);
    const result = await this.controller.validate();
    if (!result.valid) {
      alert(result.results.map(x => x.message).join(' '));
    }
  }
}

type User = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

ValidationRules.customRule(
  'matchesProperty', 
  (value, obj, otherPropertyName) =>
    value === null || 
    value === undefined || 
    value === '' || 
    obj[otherPropertyName] === null || 
    obj[otherPropertyName] === undefined || 
    obj[otherPropertyName] === '' || 
    value === obj[otherPropertyName],
  '${$displayName} must match ${$getDisplayName($config.otherPropertyName)}', 
  (otherPropertyName) => ({ otherPropertyName })
);

const userRules = ValidationRules
  .ensure((user: User) => user.firstName).required()
  .ensure((user: User) => user.lastName).required()
  .ensure((user: User) => user.email).required().email()
  .ensure((user: User) => user.password).required()
  .ensure((user: User) => user.confirmPassword).required().satisfiesRule('matchesProperty', 'password')
  .rules;
