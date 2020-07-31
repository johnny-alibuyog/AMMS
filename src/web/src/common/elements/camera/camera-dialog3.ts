import { DialogController, DialogService } from 'aurelia-dialog';
import { autoinject, computedFrom } from 'aurelia-framework';

import { Camera } from "./camera";
import { ImageCropperDialog } from '../image-cropper/image-cropper-dialog';

@autoinject()
export class CameraDialog3 {
  public title: string = 'Camera';
  public width: number = 300;
  public height: number = 225;
  public view: 'camera' | 'preview' = 'camera';
  public camera: Camera = null;
  public photo: string = null;

  constructor(
    private readonly _dialog: DialogService,
    private readonly _controller: DialogController
  ) { }

  private getSize(image: string): number {
    var base64str = image.substr(22);
    var decoded = atob(base64str);
    return decoded.length;
  }

  @computedFrom("view")
  public get isCamera(): boolean {
    return this.view === 'camera';
  }

  @computedFrom("view")
  public get isPreview(): boolean {
    return this.view === 'camera';
  }

  public async capture(): Promise<void> {
    this.photo = await this.camera.capture();
    const size = this.getSize(this.photo);
    console.log(size);
    setTimeout(() => this.view = 'preview', 500);
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

  public accept(): void {
    this._controller.ok(this.photo);
  }

  public close(): void {
    this._controller.cancel();
  }
}
