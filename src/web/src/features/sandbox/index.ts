import { PLATFORM } from 'aurelia-framework';
import { RouterConfiguration, RouteConfig, Router } from 'aurelia-router';

export class Index {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = 'Membership';
    config.map([
      ...generateUsersRoutes(),
    ]);
  }
}

const generateUsersRoutes = (): RouteConfig[] => {
  return [
    {
      title: 'Sample Prompt',
      name: 'sample-prompt',
      route: 'sample-prompt',
      moduleId: PLATFORM.moduleName('./sample-prompt'),
      nav: true,
      settings: {
        icon: 'fa-comment'
      }
    },
    {
      title: 'Sample Toast',
      name: 'sample-toast',
      route: 'sample-toast',
      moduleId: PLATFORM.moduleName('./sample-toast'),
      nav: true,
      settings: {
        icon: 'fa-bell'
      }
    },
    {
      title: 'Sample Busy Overlay',
      name: 'sample-busy-overlay',
      route: 'sample-busy-overlay',
      moduleId: PLATFORM.moduleName('./sample-busy-overlay'),
      nav: true,
      settings: {
        icon: 'fa-bell'
      }
    },
    {
      title: 'Sample Busy Overlay2',
      name: 'sample-busy-overlay2',
      route: 'sample-busy-overlay2',
      moduleId: PLATFORM.moduleName('./sample-busy-overlay2'),
      nav: true,
      settings: {
        icon: 'fa-bell'
      }
    },
    {
      title: 'Sample Camera',
      name: 'sample-camera',
      route: 'sample-camera',
      moduleId: PLATFORM.moduleName('./sample-camera'),
      nav: true,
      settings: {
        icon: 'fa-camera'
      }
    },
    {
      title: 'Sample Image Cropper',
      name: 'sample-image-cropper',
      route: 'sample-image-cropper',
      moduleId: PLATFORM.moduleName('./sample-image-cropper'),
      nav: true,
      settings: {
        icon: 'fa-portrait'
      }
    },
    {
      route: '',
      redirect: 'sample-toast'
    }
  ];
}
