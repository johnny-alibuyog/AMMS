import { autoinject } from 'aurelia-framework';
import { auth } from '.';
import { ToastService } from 'common/elements/toast/toast-service';
import { LoginCredential, intitCredential, credentialRules } from './auth.models';
import { ValidateResult, ValidationController, ValidationControllerFactory } from 'aurelia-validation';
import { ValidationFormRenderer } from 'common/validations/validation-form-renderer';


@autoinject()
export class Login {
  public now: Date = new Date();
  public serverError: string = null;
  public credential: LoginCredential = intitCredential();
  public readonly errors: ValidateResult[] = [];
  public readonly controller: ValidationController;

  constructor(
    renderer: ValidationFormRenderer,
    factory: ValidationControllerFactory,
    private readonly _toast: ToastService) {

    this.controller = factory.createForCurrentScope();
    this.controller.addRenderer(renderer);
    this.controller.addObject(this.credential, credentialRules);
  }


  public async signin(): Promise<void> {
    try {
      this.serverError = null;
      await auth.signin(this.credential);
    }
    catch (err) {
      this.serverError = (err.message == 'Unauthorized')
        ? 'Invalid user or password!'
        : err.message;

      // this._toast.error(err.message, 'Error');
    }
  }
}
