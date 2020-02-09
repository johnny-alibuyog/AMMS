import { RouterConfiguration, Router } from "aurelia-router";
import { generateRapairRoutes } from './route-repairs';
import { generateCustomerRoutes } from "./route-customers";

export class Index {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = "Services";
    config.map([
      ...generateRapairRoutes(),
      ...generateCustomerRoutes(),
    ]);
  }
}
