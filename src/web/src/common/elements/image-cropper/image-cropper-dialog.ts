import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { PromptService } from 'common/elements/prompt/prompt-service';
import Croppie, { CroppieOptions } from 'croppie';

@autoinject()
export class ImageCropperDialog {

  private _croppie: Croppie = null;

  private _imageDataUrl: string = null;

  public title: string = 'Image Cropper';

  public container: HTMLElement;

  constructor(
    private readonly _controller: DialogController,
    private readonly _prompt: PromptService) { }

  public activate(imageDataUrl: string) {
    this._imageDataUrl = imageDataUrl;
  }

  public attached(): void {
    const croppieOptions: CroppieOptions = {
      viewport: { width: 200, height: 200 },
      boundary: { width: 375, height: 250 },
      showZoomer: true,
      enableResize: true,
      enableOrientation: true,
      mouseWheelZoom: 'ctrl'
    };
    this._croppie = new Croppie(this.container, croppieOptions);
    this._croppie.bind({ url: this._imageDataUrl, });
  }

  public async apply(): Promise<void> {
    const result = await this._prompt.save('Apply', 'Do want to apply changes?');
    if (!result) {
      return;
    }
    const output = await this._croppie.result({ type: "base64" });
    await this._controller.ok(output);
  }

  public async rotate(degrees: number): Promise<void> {
    this._croppie.rotate(degrees);
  }

  public async cancel(): Promise<void> {
    await this._controller.cancel();
  }
}
