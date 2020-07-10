import { autoinject } from 'aurelia-framework';
import { DialogController, DialogService } from 'aurelia-dialog';
import { ImageCropperDialog } from '../image-cropper/image-cropper-dialog';

//https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
//https://www.digitalocean.com/community/tutorials/front-and-rear-camera-access-with-javascripts-getusermedia
//https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
//https://stackoverflow.com/questions/41641931/how-to-access-mobile-device-camera-with-javascript
//https://stackoverflow.com/questions/12024770/access-camera-from-a-browser
//https://makitweb.com/how-to-capture-picture-from-webcam-with-webcam-js/@autoinject()
@autoinject()
export class CameraDialog {

  private readonly title: string = 'Camera';

  public canvas: HTMLCanvasElement;
  public video: HTMLVideoElement;
  public audio: HTMLAudioElement;
  public photo: string;
  public height: number = 225;
  public width: number = 300;
  public shutterState: 'on' | '' = '';
  public shutterSound: string = null; 

  constructor(
    private readonly _dialog: DialogService,
    private readonly _controller: DialogController) { }

  public async activate(): Promise<void> {
    this.shutterSound = require('./camera-shutter-sound.mp3');
    if (navigator?.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = (ev) => this.video.play();
      });
    }
  }

  public async deactivate(): Promise<void> {
    const stream = this.video.srcObject as MediaStream;
    stream.getTracks().forEach(track => track.stop());
  }

  public capture(): void {
    this.triggerShutter();
    const context = this.canvas.getContext('2d');
    context.drawImage(this.video, 0, 0, this.width, this.height);
    this.photo = this.canvas.toDataURL('image/png');
  }

  private triggerShutter(): void {
    this.shutterState = 'on';
    this.audio.play();
    setTimeout(() => this.shutterState = '', 30*2+45);
    /* Shutter speed (double & add 45) */
  }

  public async crop(): Promise<void> {
    if (!this.photo) {
      return;
    }
    const settings = { viewModel: ImageCropperDialog, model: this.photo };
    const result = await this._dialog.open(settings).whenClosed();
    if (result.wasCancelled) {
      return;
    }
    this.photo = result.output;
  } 

  public cancel() : void {
    this._controller.cancel();
  }

  public usePhoto() : void {
    if (!this.photo) {
      return;
    }
    this._controller.ok(this.photo);
  }
}
