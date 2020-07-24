import { autoinject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Camera } from "./camera";
import { ImageCropperDialog } from '../image-cropper/image-cropper-dialog';
import { decode } from 'punycode';

type View = 'camera' | 'preview';

@autoinject()
export class CameraDialog3 {
  public title: string = 'Camera';
  public width: number = 300;
  public height: number = 225;
  public view: View = 'camera';
  public camera: Camera = null;
  public photo: string = null;

  constructor(private readonly _dialog: DialogService) {}

  private getSize(image: string) : number {
    var base64str = image.substr(22);
    var decoded = atob(base64str);
    return decoded.length;
  }

  public async capture(): Promise<void> {
    this.photo = await this.camera.capture();
    const size = this.getSize(this.photo);
    console.log(size);
    debugger;
    // this.view = 'preview';
    setTimeout(() => this.view = 'preview', 200);
  }

  public back(): void {
    this.view = 'camera';
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
}
