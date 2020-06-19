import { autoinject, bindable } from 'aurelia-framework';
import { ToastController } from './toast-controller';
import { ToastSettings, ToastType, ToastPosition } from './toast-service';

@autoinject()
export class Toast {

  @bindable()
  public type: ToastType;

  @bindable()
  public title: string;

  @bindable()
  public message: string;

  @bindable()
  public closable: boolean = true;

  @bindable()
  public clearable: boolean = true;

  @bindable()
  public position: ToastPosition = "toast-top-right";

  private _isClosed = false;

  constructor(private readonly _controller: ToastController) { }

  public close(): void {
    if (!this._isClosed) {
      this._controller.close();
      this._isClosed = true;
    }

  }

  public activate(options: Partial<ToastSettings>): void {
    this.type = options.type;
    this.title = options.title;
    this.message = options.message;
    this.closable = options.closable;
    this.clearable = options.clearable;
    this.position = options.position;
    setTimeout(() => this.close(), options.duration * 100000);
  }
}
