import { ScreenSize, MediaService } from "../../common/services/media-service";
import { autoinject, bindable } from "aurelia-framework";
import { Router } from "aurelia-router";

@autoinject()
export class PageHeader {
  @bindable()
  public router: Router;

  public model = {
    isOpen: false,
    isCollapsible: false
  };

  constructor(private readonly _mediaService: MediaService) {}

  private screenChangedListener = (size: ScreenSize) => {
    this.model.isCollapsible = size === ScreenSize.ExtraSmall;
    this.model.isOpen = !this.model.isCollapsible;
  };

  public attached(): void {
    this.screenChangedListener(this._mediaService.screenSize);
    this._mediaService.addChangedLister(this.screenChangedListener);
  }

  public detached(): void {
    this._mediaService.removeChangedListener(this.screenChangedListener);
  }

  public toggle(): void {
    this.model.isOpen = !this.model.isOpen;
  }
}
