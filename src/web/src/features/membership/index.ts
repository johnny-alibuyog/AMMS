import { RouteConfig, Router, RouterConfiguration } from 'aurelia-router';

import { PLATFORM } from 'aurelia-framework';

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
        icon: 'fa-user'
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
      title: 'Roles',
      name: `${prefix}/role-list`,
      route: `${prefix}/role-list`,
      moduleId: PLATFORM.moduleName('./roles/role-list'),
      nav: true,
      settings: {
        // group: properCase(prefix),
        icon: 'fa-user-shield'
      }
    },
    {
      title: 'Role',
      name: `${prefix}/role-form`,
      route: `${prefix}/role-form`,
      moduleId: PLATFORM.moduleName('./roles/role-form'),
      nav: false
    },
    {
      title: 'Branches',
      name: `${prefix}/branch-list`,
      route: `${prefix}/branch-list`,
      moduleId: PLATFORM.moduleName('./branches/branch-list'),
      nav: true,
      settings: {
        // group: properCase(prefix),
        icon: 'fa-map-marked-alt'
      }
    },
    {
      title: 'Branch',
      name: `${prefix}/branch-form`,
      route: `${prefix}/branch-form`,
      moduleId: PLATFORM.moduleName('./branches/branch-form'),
      nav: false
    },
    {
      route: '',
      redirect: `${prefix}/user-list`
    }
  ];
}
