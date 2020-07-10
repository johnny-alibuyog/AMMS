import { autoinject, bindable, bindingMode } from 'aurelia-framework';
import { NavigationInstruction } from 'aurelia-router';
import { Router } from 'aurelia-router';


/*
 * this breadcurmbs is based on the route
 */
@autoinject()
export class Breadcrumbs {

  public router: Router;

  constructor(router: Router) {
    while (router.parent) {
      router = router.parent;
    }

    this.router = router;
  }

  public navigate(instruction: NavigationInstruction) {
    this.router.navigateToRoute(instruction.config.name, instruction.queryParams);
  }
}
