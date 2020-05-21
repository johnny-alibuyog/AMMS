import { Router, RouterConfiguration } from "aurelia-router";
import { PLATFORM, autoinject } from "aurelia-framework";

@autoinject()
export class App {
  public title: string = "Shell";
  public router: Router;

  configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = this.title;
    config.map([
      {
        title: "Dashboard",
        name: "dashboard",
        route: "dashboard",
        moduleId: PLATFORM.moduleName("./features/dashboard/index"),
        nav: true
      },
      {
        title: "Services",
        name: "services",
        route: "services",
        moduleId: PLATFORM.moduleName("./features/services/index"),
        nav: true
      },
      {
        title: "Membership",
        name: "membership",
        route: "membership",
        moduleId: PLATFORM.moduleName("./features/membership/index"),
        nav: true
      },
      {
        title: "Settings",
        name: "user/user-settings",
        route: "user/user-settings",
        moduleId: PLATFORM.moduleName("./features/settings/user-settings"),
        nav: true
      },
      {
        title: "Sandbox",
        name: "sandbox/property-page",
        route: "sandbox/property-page",
        moduleId: PLATFORM.moduleName("./features/sandbox/property-page"),
        nav: true
      },
      {
        route: "",
        redirect: "services"
      }
    ]);
  }
}
