import { autoinject, ViewSlot,  Controller } from 'aurelia-framework';
import { ToastSettings, ToastPosition } from './toast-service';

@autoinject()
export class ToastRenderer {
  private toastContainers = new Map<ToastPosition, ViewSlot>();

  public render(controller: Controller, options: Partial<ToastSettings>): void {
    // this._mixinControllerMethods(controller);
    let viewSlot = this.createToastContainer(options);
    //controller.view.bind(options);
    viewSlot.add(controller.view);
  }

  public unrender(controller: Controller) {
    const viewModel = controller.viewModel as ToastSettings;
    const viewSlot = this.toastContainers.get(viewModel.position);
    if (viewSlot) {
      viewSlot.remove(controller.view);
    }
  }

  private createToastContainer(options: Partial<ToastSettings>) : ViewSlot {
    const position = options.position;
    if (this.toastContainers.has(position)) {
      return this.toastContainers.get(position);
    }

    const container = document.createElement('div');
    container.id = 'toast-container';
    container.classList.add(options.position);
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('role', 'alert');
    document.body.insertBefore(container, document.body.firstChild);
    const containerViewSlot = new ViewSlot(container, true);
    this.toastContainers.set(position, containerViewSlot);
    return containerViewSlot;
  }
}

