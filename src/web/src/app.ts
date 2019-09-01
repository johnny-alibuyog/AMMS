// import { RouterConfiguration, Router } from 'aurelia-router';
// import { PLATFORM } from 'aurelia-pal';
// import { autoinject } from 'aurelia-framework';

// @autoinject()
// export class App {
//   public message: string = 'Hello World!';
//   public router: Router;

//   configureRouter(config: RouterConfiguration, router: Router): void {
//     this.router = router;
//     config.title = this.message;
//     config.map([
//       {
//         title: 'user-dashboard',
//         name: 'user-dashboard',
//         route: ['', 'user-dashboard'],
//         moduleId: PLATFORM.moduleName('./dashboard/user-dashboard'),
//         nav: true
//       },
//       {
//         title: 'user-settings',
//         name: 'user-settings',
//         route: ['user-settings'],
//         moduleId: PLATFORM.moduleName('./settings/user-settings'),
//         nav: true
//       }
//     ]);
//   }
// }

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
        // moduleId: PLATFORM.moduleName('./services/repairs/diagnosis-list'),
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

  // public configureRouter(config: RouterConfiguration, router: Router) {
  //   this.router = router;
  //   config.title = this.title;
  //   config.options.pushState = true;
  //   config.options.root = '/';
  //   config.map([
  //     {
  //       route: [ '', 'account-settings'],
  //       name: 'account-settings',
  //       moduleId: PLATFORM.moduleName('./accounts/settings'),
  //       nav: true,
  //       // main: true,
  //       // title: 'Settings',
  //     },
  //     {
  //       route: ['account-profile'],
  //       name: 'account-profile',
  //       moduleId: PLATFORM.moduleName('./accounts/profile'),
  //        nav: true,
  //       // main: true,
  //       // title: 'Profile',
  //     },
  //     // {
  //     //   route: '',
  //     //   redirect: 'account-profile'
  //     // }
  //   ]);
  // }
}
