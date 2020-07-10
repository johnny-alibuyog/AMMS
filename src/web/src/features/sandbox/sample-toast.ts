import { autoinject } from 'aurelia-framework';
import { ToastService } from 'common/elements/toast/toast-service';

@autoinject()
export class SampleToast {
  public title: string = 'Sample Toast';

  constructor(private readonly _toast: ToastService) { }

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
