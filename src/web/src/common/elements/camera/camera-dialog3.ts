import { autoinject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Camera } from "./camera";
import { ImageCropperDialog } from '../image-cropper/image-cropper-dialog';

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

  public async capture(): Promise<void> {
    this.photo = await this.camera.capture();
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
