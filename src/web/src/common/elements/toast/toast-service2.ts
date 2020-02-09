import { default as iziToast, IziToastPosition, IziToastSettings } from 'izitoast';

export class ToastService2 {
  private buildSettings(message: string, title: string) : IziToastSettings {
    return {
      message: message,
      title: title,
      color: 'dark',
      icon: 'fa fa-user',
      position: 'center', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter
      progressBarColor: 'rgb(0, 255, 184)',
    }
  }

  public info(message: string, title: string = 'Info'): void {
    iziToast.info({ message, title, position: 'topRight' })
  }

  public success(message: string, title: string = 'Success'): void {
    const settings = this.buildSettings(message, title);
    iziToast.show(settings);
  }

  public warning(message: string, title: string = 'Warning'): void {
    iziToast.warning({ message, title, position: 'topRight' })
  }

  public error(message: string, title: string = 'Error'): void {
    iziToast.error({ message, title, position: 'topRight' })
  }
}
