import { PLATFORM } from 'aurelia-framework';
import { properCase } from 'common/utils';
import { RouterConfiguration, RouteConfig, Router } from 'aurelia-router';

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

const generateRapairRoutes = (prefix: string = 'repairs'): RouteConfig[] => {
  return [
    {
      title: 'Diagnoses',
      route: `${prefix}/diagnoses`,
      name: `${prefix}/diagnoses`,
      moduleId: PLATFORM.moduleName('./repairs/diagnosis-list'),
      nav: true,
      settings: {
        group: `${properCase(prefix)}`,
        icon: 'fa-tasks'
      }
    },
    {
      title: 'Diagnosis',
      name: `${prefix}/diagnosis`,
      route: `${prefix}/diagnosis`,
      moduleId: PLATFORM.moduleName('./repairs/diagnosis-form'),
      nav: false,
    },
    {
      title: 'Quotations',
      name: `${prefix}/quotations`,
      route: `${prefix}/quotations`,
      moduleId: PLATFORM.moduleName('./repairs/quotation-list'),
      nav: true,
      settings: {
        group: `${properCase(prefix)}`,
        icon: 'fa-calculator'
      }
    },
    {
      title: 'Quotation',
      name: `${prefix}/quotation`,
      route: `${prefix}/quotation`,
      moduleId: PLATFORM.moduleName('./repairs/quotation-form'),
      nav: false
    },
    {
      title: 'Job Orders',
      name: `${prefix}/job-orders`,
      route: `${prefix}/job-orders`,
      moduleId: PLATFORM.moduleName('./repairs/job-order-list'),
      nav: true,
      settings: {
        group: `${properCase(prefix)}`,
        icon: 'fa-wrench'
      }
    },
    {
      title: 'Job Order',
      name: `${prefix}/job-order`,
      route: `${prefix}/job-order`,
      moduleId: PLATFORM.moduleName('./repairs/job-order-form'),
      nav: false
    },
    {
      route: '',
      redirect: 'repairs/diagnoses'
    }
  ];
}

const generateCustomerRoutes = (prefix: string = 'customers'): RouteConfig[] => {
  return [
    {
      title: 'Customers',
      name: `${prefix}/customer-list`,
      route: `${prefix}/customer-list`,
      moduleId: PLATFORM.moduleName('./customers/customer-list'),
      nav: true,
      settings: {
        group: properCase(prefix),
        icon: 'fa-users'
      }
    },
    {
      title: 'Customer',
      name: `${prefix}/customer-form`,
      route: `${prefix}/customer-form`,
      moduleId: PLATFORM.moduleName('./customers/customer-form'),
      nav: false
    }
  ];
}
