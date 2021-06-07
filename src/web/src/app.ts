import { NavigationInstruction, Next, PipelineStep, Redirect, Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM, autoinject } from 'aurelia-framework';

import { Resource } from 'features/membership/resources/resource.model';
import { resources } from 'features/membership/resources/resource.data';

@autoinject()
export class App {
  public title: string = 'Shell';
  public router: Router;

  configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = this.title;
    config.map([
      {
        title: 'Dashboard',
        name: 'dashboard',
        route: 'dashboard',
        moduleId: PLATFORM.moduleName('./features/dashboard/index'),
        nav: true,
      },
      {
        title: 'Services',
        name: 'services',
        route: 'services',
        moduleId: PLATFORM.moduleName('./features/services/index'),
        nav: true
      },
      {
        title: 'Membership',
        name: 'membership',
        route: 'membership',
        moduleId: PLATFORM.moduleName('./features/membership/index'),
        nav: true
      },
      {
        title: 'Settings',
        name: 'user/user-settings',
        route: 'user/user-settings',
        moduleId: PLATFORM.moduleName('./features/settings/user-settings'),
        nav: true
      },
      {
        title: 'Sandbox',
        name: 'sandbox/property-page',
        route: 'sandbox/property-page',
        moduleId: PLATFORM.moduleName('./features/sandbox/index'),
        nav: true
      },
      {
        route: '',
        redirect: 'services'
      }
    ]);
  }
}

class AuthorizationStep implements PipelineStep {
  public run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
    const resources = navigationInstruction.getAllInstructions()
      .flatMap(i => i.config.settings.resources as Resource[]);


    if (navigationInstruction.getAllInstructions().some(i => i.config.settings.roles.indexOf('admin') !== -1)) {
      var isAdmin = /* insert magic here */false;
      if (!isAdmin) {
        return next.cancel(new Redirect('services'));
      }
    }

    return next();
  }
}

