import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { PromptService } from '../../../common/elements/prompt/prompt-service';
import { ValidationRules, ValidationControllerFactory, ValidationController, ValidateResult } from 'aurelia-validation';
import { ToastService } from 'common/elements/toast/toast-service';
import { ValidationFormRenderer } from '../../../common/validations/validation-form-renderer';
import { BreadcrumbItem } from '../../../common/elements/breadcrumbs/custom-breadcrumbs';
import { rules } from '../../../common/validations/validation-custom-rules';

@autoinject()
export class DiagnosisForm {
  public title: string = 'Diagnosis';
  public user: User = <User>{};
  public breadcrumbItems: BreadcrumbItem[] = [];
  public readonly errors: ValidateResult[] = [];
  public readonly controller: ValidationController;

  constructor(
    private readonly _router: Router,
    private readonly _toast: ToastService,
    private readonly _prompt: PromptService,
    renderer: ValidationFormRenderer,
    factory: ValidationControllerFactory
  ) {
    this.controller = factory.createForCurrentScope();
    this.controller.addRenderer(renderer);
    this.controller.addObject(this.user, userRules);
  }

  public async activate(params: any): Promise<void> {
    this.breadcrumbItems = [
      { title: "Diagnoses", url: this._router.generate("repairs/diagnoses") },
      { title: "New Diagnosis", url: this._router.generate("repairs/diagnosis") }
    ];
  }

  public async submit(): Promise<void> {
    const promptResult = await this._prompt.save('Title', 'Prompt Message');
    if (promptResult) {
      return;
    }
    
    const valResult = await this.controller.validate();
    if (!valResult.valid) {
      await this._toast.error('Validaton Error', 'Error');
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
    await this._toast.success('reset', 'Sucess');
  }

  public error(): void {
    this._toast.error('This is an error!', 'Error');
  }

  public warning(): void {
    this._toast.warning('This is a warning!', 'Warning');
  }

  public info(): void {
    this._toast.info('This is an info!', 'Info');
  }

  public success(): void {
    this._toast.success('This is success!', 'Success');
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
