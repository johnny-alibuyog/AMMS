// import { FingerprintReader, SampleFormat } from '@digitalpersona/devices';
import { SigninCredential, intitCredential } from './auth.models';
import { ValidateResult, ValidationController, ValidationControllerFactory } from 'aurelia-validation';

import { ToastService } from 'common/elements/toast/toast-service';
import { ValidationFormRenderer } from 'common/validations/validation-form-renderer';
import { auth } from '.';
import { autoinject } from 'aurelia-framework';
import { credentialRules } from './auth.validation';

@autoinject()
export class Signin {
  // private reader: FingerprintReader;

  public now: Date = new Date();
  public serverError: string = null;
  public credential: SigninCredential = intitCredential();
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

  public async activate(): Promise<void> {
    // this.reader = new FingerprintReader();
    // this.reader.onDeviceConnected = (device) => console.error(`Digital Persona: onDeviceConnected (${JSON.stringify(device, null, 2)})`);
    // this.reader.onDeviceDisconnected = (device) => console.error(`Digital Persona: onDeviceDisconnected (${JSON.stringify(device, null, 2)})`);
    // this.reader.onQualityReported = (quality) => console.error(`Digital Persona: onQualityReported (${JSON.stringify(quality, null, 2)})`);
    // this.reader.onSamplesAcquired = (data) => console.error(`Digital Persona: onSamplesAcquired (${JSON.stringify(data, null, 2)})`);
    // this.reader.onErrorOccurred = (reason) => console.error(`Digital Persona: onErrorOccurred (${JSON.stringify(reason, null, 2)})`);
    // await this.reader.startAcquisition(SampleFormat.Intermediate)
  }

  public async deactivate(): Promise<void> {
    // await this.reader.stopAcquisition();
    // this.reader.off();
    // delete this.reader;
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
