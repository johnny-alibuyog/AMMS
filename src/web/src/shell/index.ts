import { Router, RouterConfiguration } from "aurelia-router";
import { PLATFORM } from "aurelia-framework";

export class Index {
  public title: string = "Shell";
  public router: Router = null;
  public routerCount: number;

  public configureRouter(config: RouterConfiguration, router: Router) {
    debugger;
    config.title = this.title;
    config.options.pushState = true;
    config.options.root = "/";
    config.map([
      {
        route: ["", "account-settings"],
        name: "account-settings",
        moduleId: PLATFORM.moduleName("../accounts/settings")
        // nav: true,
        // main: true,
        // title: 'Settings',
      },
      {
        route: ["account-profile"],
        name: "account-profile",
        moduleId: PLATFORM.moduleName("../accounts/profile")
        // nav: true,
        // main: true,
        // title: 'Profile',
      }
      // {
      //   route: '',
      //   redirect: 'account-profile'
      // }
    ]);
    this.router = router;
    this.routerCount = this.router.navigation.length;
  }
}
