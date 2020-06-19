import { autoinject, Controller } from 'aurelia-framework';
import { ToastSettings, invokeLifecycle } from "./toast-service";
import { ToastRenderer } from "./toast-renderer";

@autoinject()
export class ToastController {
  /**
   * @internal
   */
  public closePromise: Promise<any> | undefined;

  /**
   * The settings used by this controller.
   */
  private controller: Controller;
  private settings: ToastSettings;

  constructor(public readonly renderer: ToastRenderer) { }

  public setController(controller: Controller) {
    this.controller = controller;
    this.controller.automate();
  }

  public set(param: { controller: Controller, settings: ToastSettings }): void {
    this.settings = param.settings;
    this.controller = param.controller;
    this.controller.automate();
  }

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
    this.renderer.render(this.controller, this.settings);
  }
}
