import { PLATFORM } from "aurelia-pal";
import { RouterConfiguration, Router } from "aurelia-router";

export class Index {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = "Dashboard";
    config.map([
      {
        title: "User Dashboard",
        route: "user-dashboard",
        name: "user-dashboard",
        moduleId: PLATFORM.moduleName("./user-dashboard")
      },
      {
        route: "",
        redirect: "user-dashboard"
      }
    ]);
  }
}
