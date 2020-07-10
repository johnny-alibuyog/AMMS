import { DialogService } from 'aurelia-dialog';
import { autoinject } from 'aurelia-framework';
import { ImageCropperDialog } from 'common/elements/image-cropper/image-cropper-dialog';

@autoinject()
export class SampleImageCropper {
  public title: string = 'Image Cropper';
  // public imageSource: string = 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80';
  public imageSource: string = require('./hon.jpg');

  constructor(private readonly _dialog: DialogService) { }

  public async crop(): Promise<void> {
    const settings = { viewModel: ImageCropperDialog, model: this.imageSource };
    const result = await this._dialog.open(settings).whenClosed();
    if (result.wasCancelled) return;
    this.imageSource = result.output;
  }
}
