import { bindable, bindingMode } from "aurelia-framework";
import { Router } from "aurelia-router";

export class MenuLayoutSideBar {
  public isOpen: boolean;

  @bindable()
  public displayMenuTitle: boolean;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  public heading: string;

  @bindable({ defaultBindingMode: bindingMode.twoWay })
  public router: Router;

  public xs: number[] = [];

  public toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
