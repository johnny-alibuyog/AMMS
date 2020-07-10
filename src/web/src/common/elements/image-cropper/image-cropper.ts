import { bindable, bindingMode } from 'aurelia-framework';
import Croppie, { CroppieOptions } from 'croppie';

export class ImageCropper {

  private _croppie: Croppie = null;

  public container: HTMLElement;

  @bindable()
  public source: string;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  public output: string;

  public bind(): void {
    const croppieOptions: CroppieOptions = {
      viewport: { width: 200, height: 200 },
      boundary: { width: 375, height: 250 },
      showZoomer: true,
      enableResize: true,
      enableOrientation: true,
      mouseWheelZoom: 'ctrl'
    };
    this._croppie = new Croppie(this.container, croppieOptions);
    this._croppie.bind({ url: this.source, });
  }

  public rotate = (degrees: number): void => this._croppie.rotate(degrees);

  public rotateLeft = (): void => this.rotate(-90);

  public rotateRight = (): void => this.rotate(90);

  public apply = async (): Promise<string> => {
    this.output = await this._croppie.result({ type: "base64" });
    return this.output;
  }
}
