import { PLATFORM } from 'aurelia-framework';
import { RouterConfiguration, RouteConfig, Router } from 'aurelia-router';

export class Index {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = "Membership";
    config.map([
      ...generateUsersRoutes(),
    ]);
  }
}

const generateUsersRoutes = (prefix: string = 'users'): RouteConfig[] => {
  return [
    {
      title: 'Users',
      name: `${prefix}/user-list`,
      route: `${prefix}/user-list`,
      moduleId: PLATFORM.moduleName('./users/user-list'),
      nav: true,
      settings: {
        // group: properCase(prefix),
        icon: 'fa-users'
      }
    },
    {
      title: 'User',
      name: `${prefix}/user-form`,
      route: `${prefix}/user-form`,
      moduleId: PLATFORM.moduleName('./users/user-form'),
      nav: false
    },
    {
      route: '',
      redirect: `${prefix}/user-list`
    }
  ];
}
