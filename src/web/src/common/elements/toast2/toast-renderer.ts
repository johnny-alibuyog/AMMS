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
    // container.setAttribute('class', 'z-50 flex items-end fixed inset-0 space-x-2 justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end');
    // container.setAttribute('class', 'z-50 flex items-end fixed inset-0 space-x-2 space-x-reverse space-y-2 space-y-reverse justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end');
    // container.setAttribute('class', 'z-50 flex flex-col space-y-2 fixed inset-0 flex px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end');
    // container.setAttribute('class', 'z-50 space-y-2 fixed inset-0 px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end');
    // container.setAttribute('class', 'z-50 flex flex-col space-y-2 fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end');
    document.body.insertBefore(container, document.body.firstChild);
    const containerViewSlot = new ViewSlot(container, true);
    this.toastContainers.set(position, containerViewSlot);
    return containerViewSlot;
  }
}

