import { autoinject } from 'aurelia-framework';
import { ValidationRules, ValidationControllerFactory, ValidationController, ValidateResult } from 'aurelia-validation';
import { Router } from 'aurelia-router';
import { ToastService } from 'common/elements/toast/toast-service';
import { ToastService2 } from 'common/elements/toast/toast-service2';
import { ValidationFormRenderer } from '../../common/validations/validation-form-renderer';
import { BreadcrumbItem } from '../../common/elements/custom-breadcrumbs';
import { rules } from '../../common/validations/validation-custom-rules';

@autoinject()
export class DiagnosisForm {
  public title: string = 'Diagnosis';
  public user: User = <User>{};
  public breadcrumbItems: BreadcrumbItem[] = [];
  public readonly errors: ValidateResult[] = [];
  public readonly controller: ValidationController;

  constructor(
    private readonly router: Router,
    private readonly toast: ToastService,
    private readonly toast2: ToastService2,
    renderer: ValidationFormRenderer,
    factory: ValidationControllerFactory
  ) {
    this.controller = factory.createForCurrentScope();
    this.controller.addRenderer(renderer);
    this.controller.addObject(this.user, userRules);
  }

  public async activate(params: any): Promise<void> {
    this.breadcrumbItems = [
      { title: "Diagnoses", url: this.router.generate("repairs/diagnoses") },
      { title: "New Diagnosis", url: this.router.generate("repairs/diagnosis") }
    ];
  }

  public async submit(): Promise<void> {
    console.log(this.errors);
    const result = await this.controller.validate();
    if (!result.valid) {
      await this.toast.error('Validaton Error', 'Error');
      this.toast2.error('Validaton Error', 'Error');
    }
  }

  public async reset(): Promise<void> {
    Object.assign(this.user, <User>{
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    this.controller.reset();
    await this.toast.success('reset', 'Sucess');
    this.toast2.success('reset', 'Sucess');
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

const userRules = ValidationRules
  .ensure((user: User) => user.firstName).required()
  .ensure((user: User) => user.lastName).required()
  .ensure((user: User) => user.email).required().email()
  .ensure((user: User) => user.password).required()
  .ensure((user: User) => user.confirmPassword).required().satisfiesRule(rules.matchesProperty, 'password')
  .rules;
