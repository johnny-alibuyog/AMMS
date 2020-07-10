import { bindable, bindingMode } from 'aurelia-framework';

export class Camera {
  public canvas: HTMLCanvasElement;
  public video: HTMLVideoElement;
  public audio: HTMLAudioElement;
  public shutterState: 'open' | 'close' = 'close';
  public shutterSound: string = null;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  public height: number = null;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  public width: number = null;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  public photo: string = null;

  public attached(): void {
    this.shutterSound = require('./camera-shutter-sound.mp3');
    if (navigator?.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = (ev) => this.video.play();
      });
    }
  }

  public detached(): void {
    const stream = this.video.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
  }

  public async capture(): Promise<string> {
    this.photo = await this.shutterOpen(this.snapShot);
    return this.photo;
  }

  private snapShot = (): string => {
    const context = this.canvas.getContext('2d');
    context.drawImage(this.video, 0, 0, this.width, this.height);
    const photo = this.canvas.toDataURL('image/png');
    return photo;
  }

  private shutterOpen = (snapShot: () => string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      this.shutterState = 'open';
      setTimeout(() => {
        this.audio.play();
        const photo = snapShot();
        this.shutterState = 'close';
        resolve(photo);
      }, 30 * 2 + 45); /* Shutter speed (double & add 45) */
    });
  }
}
