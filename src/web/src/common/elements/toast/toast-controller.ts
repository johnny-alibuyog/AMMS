import { autoinject, Controller } from 'aurelia-framework';
import { ToastSettings, invokeLifecycle } from "./toast-service";
import { ToastRenderer } from "./toast-renderer";

@autoinject()
export class ToastController {
  // private resolve: (data?: any) => void;
  // private reject: (reason: any) => void;

  /**
   * @internal
   */
  public closePromise: Promise<any> | undefined;

  /**
   * The settings used by this controller.
   */
  private controller: Controller;
  private settings: ToastSettings;

  public setController(controller: Controller) {
    this.controller = controller;
    this.controller.automate();
  }

  public set(param: { controller: Controller, settings: ToastSettings }): void {
    this.settings = param.settings;
    this.controller = param.controller;
    this.controller.automate();
  }

  // public get controller() : Controller {
  //   return this._controller;
  // }

  /**
   * Creates an instance of DialogController.
   */
  // constructor(
  //   renderer: ToastRenderer,
  //   settings: ToastSettings,
  //   resolve: (data?: any) => void,
  //   reject: (reason: any) => void) {
  //   this.resolve = resolve;
  //   this.reject = reject;
  //   this.settings = settings;
  //   this.renderer = renderer;
  // }
  constructor(public readonly renderer: ToastRenderer) { }

  public async close(): Promise<void> {
    const canDeactivate = await invokeLifecycle(this.controller.viewModel || {}, 'canDeactivate', {});
    if (canDeactivate) {
      await invokeLifecycle(this.controller.viewModel, 'deactivate', {});
      this.renderer.unrender(this.controller);
      this.controller.detached();
      this.controller.unbind();
    }
  }

  public open(): void {
    debugger;
    this.renderer.render(this.controller, this.settings);
  }

  // /**
  //  * @internal
  //  */
  // public releaseResources(result: DialogCloseResult | DialogCloseError): Promise<void> {
  //   return invokeLifecycle(this.controller.viewModel || {}, 'deactivate', result)
  //     .then(() => this.renderer.hideDialog(this))
  //     .then(() => {
  //       this.controller.unbind();
  //     });
  // }



  // /**
  //  * @internal
  //  */
  // public cancelOperation(): DialogCancelResult {
  //   if (!this.settings.rejectOnCancel) {
  //     return { wasCancelled: true };
  //   }
  //   throw createDialogCancelError();
  // }

  // /**
  //  * Closes the dialog with a successful output.
  //  * @param output The returned success output.
  //  */
  // public ok(output?: any): Promise<DialogCancelableOperationResult> {
  //   return this.close(true, output);
  // }

  // /**
  //  * Closes the dialog with a cancel output.
  //  * @param output The returned cancel output.
  //  */
  // public cancel(output?: any): Promise<DialogCancelableOperationResult> {
  //   return this.close(false, output);
  // }

  // /**
  //  * Closes the dialog with an error output.
  //  * @param output A reason for closing with an error.
  //  * @returns Promise An empty promise object.
  //  */
  // public error(output: any): Promise<void> {
  //   const closeError = createDialogCloseError(output);
  //   return this.releaseResources(closeError).then(() => { this.reject(closeError); });
  // }

  // /**
  //  * Closes the dialog.
  //  * @param ok Whether or not the user input signified success.
  //  * @param output The specified output.
  //  * @returns Promise An empty promise object.
  //  */
  // public close(ok: boolean, output?: any): Promise<DialogCancelableOperationResult> {
  //   if (this.closePromise) {
  //     return this.closePromise;
  //   }

  //   const dialogResult: DialogCloseResult = { wasCancelled: !ok, output };

  //   return this.closePromise = invokeLifecycle(this.controller.viewModel || {}, 'canDeactivate', dialogResult)
  //     .catch(reason => {
  //       this.closePromise = undefined;
  //       return Promise.reject(reason);
  //     }).then(canDeactivate => {
  //       if (!canDeactivate) {
  //         this.closePromise = undefined; // we are done, do not block consecutive calls
  //         return this.cancelOperation();
  //       }
  //       return this.releaseResources(dialogResult).then(() => {
  //         if (!this.settings.rejectOnCancel || ok) {
  //           this.resolve(dialogResult);
  //         } else {
  //           this.reject(createDialogCancelError(output));
  //         }
  //         return { wasCancelled: false };
  //       }).catch(reason => {
  //         this.closePromise = undefined;
  //         return Promise.reject(reason);
  //       });
  //     });
  // }
}
