import { ToastController } from './toast-controller';
import { autoinject, Container, CompositionEngine, CompositionContext, Origin } from 'aurelia-framework';
import { Toast } from './toast';

const defaults: Partial<ToastSettings> = {
  debug: false,
  position: 'toast-top-right',
  startingZIndex: 1000,
  duration: 5 /* 5 sec */
};

export type ToastType
  = 'error'
  | 'info'
  | 'success'
  | 'warning';

export type ToastPosition
  = 'toast-top-right'
  | 'toast-bottom-right'
  | 'toast-bottom-left'
  | 'toast-top-left'
  | 'toast-top-full-width'
  | 'toast-bottom-full-width'
  | 'toast-top-center'
  | 'toast-bottom-center';

export type ToastSettings = {
  type: ToastType,
  position: ToastPosition,
  message: string,
  title: string,
  closable: boolean,
  clearable: boolean,
  debug: boolean,
  progressBar: boolean,
  preventDuplicates: boolean,
  newestOnTop: boolean,
  startingZIndex: number,
  duration: number,
  model: any
}

@autoinject()
export class ToastService {

  constructor(
    private readonly container: Container,
    private readonly compositionEngine: CompositionEngine,
    public readonly controllers: ToastController[] = []
  ) { }

  public error(message: string, title: string, options: Partial<ToastSettings> = {}): Promise<void> {
    return this.notify('error', message, title, options);
  }

  public info(message: string, title: string, options: Partial<ToastSettings> = {}): Promise<void> {
    return this.notify('info', message, title, options);
  }

  public success(message: string, title: string, options: Partial<ToastSettings> = {}): Promise<void> {
    return this.notify('success', message, title, options);
  }

  public warning(message: string, title: string, options: Partial<ToastSettings> = {}): Promise<void> {
    return this.notify('warning', message, title, options);
  }

  // public clearAll(): void {
  //   let length = this._toasts.length;
  //   while (length--) {
  //     let toast = this._toasts.pop();
  //     toast.remove();
  //   }
  //   this._containers.forEach((value) => value.remove());
  //   this._containers.clear();
  // }

  // public clearLast(): void {
  //   let toast = this._toasts.pop();
  //   toast.remove();
  // }

  public async notify(type: ToastType, message: string, title: string, settings: Partial<ToastSettings> = {}): Promise<void> {
    const mergedSettings = Object.assign({}, defaults, settings, {
      type: type,
      message: message,
      title: title,
      closable: true
    }) as ToastSettings;
    const childContainer = this.container.createChild();
    const toastController = childContainer.invoke(ToastController);
    const context: CompositionContext = {
      bindingContext: null,
      viewModel: new Toast(toastController),
      container: this.container,
      childContainer: childContainer,
      model: mergedSettings,
      viewResources: null,
      viewSlot: null
    };
    const instruction = await ensureCompositionContext(context, this.compositionEngine);
    const canActivate = await invokeLifecycle(instruction.viewModel, 'canActivate', settings.model);
    if (canActivate) {
      toastController.set({
        settings: instruction.model,
        controller: await this.compositionEngine.createController(instruction)
      });
      toastController.open();
    }
  }
}

function removeController(service: ToastService, dialogController: ToastController): void {
  const i = service.controllers.indexOf(dialogController);
  if (i !== -1) {
    service.controllers.splice(i, 1);
  }
}

export type LifecycleMethodName = 'canActivate' | 'activate' | 'canDeactivate' | 'deactivate';

export function invokeLifecycle(instance: any, name: LifecycleMethodName, model: any): Promise<any> {
  if (typeof instance[name] !== 'function') {
    return Promise.resolve(true);
  }
  const result = instance[name](model);
  if (result instanceof Promise) return result;
  if (result !== null && result !== undefined) {
    return Promise.resolve(result);
  }
  return Promise.resolve(true);
}

export async function ensureCompositionContext(context: CompositionContext, compositionEngine: CompositionEngine): Promise<CompositionContext> {
  if (typeof context.viewModel === 'function') {
    context.viewModel = Origin.get(context.viewModel).moduleId;
  }
  else if (typeof context.viewModel === 'string') {
    return await compositionEngine.ensureViewModel(context);
  }
  return context;
}
