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
        title: "Services",
        name: "services",
        route: "services",
        moduleId: PLATFORM.moduleName("./services/index"),
        nav: true
      },
      {
        title: "Dashboard",
        name: "dashboard",
        route: "dashboard",
        moduleId: PLATFORM.moduleName("./dashboard/index"),
        nav: true
      },
      {
        title: "Settings",
        name: "user/user-settings",
        route: "user/user-settings",
        moduleId: PLATFORM.moduleName("./settings/user-settings"),
        nav: true
      },
      {
        title: "Sandbox",
        name: "sandbox/property-page",
        route: "sandbox/property-page",
        moduleId: PLATFORM.moduleName("./sandbox/property-page"),
        nav: true
      },
      {
        route: "",
        redirect: "services"
      }
    ]);
  }
}
