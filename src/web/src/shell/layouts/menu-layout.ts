import { bindable } from "aurelia-framework";
import { Router } from "aurelia-router";

export class MenuLayout {
  @bindable()
  public router: Router;
}
