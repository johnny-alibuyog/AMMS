import { autoinject } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { CameraDialog } from 'common/elements/camera/camera-dialog';
import { CameraDialog2 } from 'common/elements/camera/camera-dialog2';
import { CameraDialog3 } from 'common/elements/camera/camera-dialog3';

@autoinject()
export class SampleCamera {
  public title: string = 'Camera';
  public imageSource: string = require('./hon.jpg');

  constructor(private readonly _dialog: DialogService) { }

  public async capture(): Promise<void> {
    const settings = { viewModel: CameraDialog, model: this.imageSource };
    const result = await this._dialog.open(settings).whenClosed();
    if (result.wasCancelled) return;
    this.imageSource = result.output;
  } 

  public async capture2(): Promise<void> {
    const settings = { viewModel: CameraDialog2 };
    const result = await this._dialog.open(settings).whenClosed();
  } 

  public async capture3(): Promise<void> {
    const settings = { viewModel: CameraDialog3 };
    const result = await this._dialog.open(settings).whenClosed();
  }
}
