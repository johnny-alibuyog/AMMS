import { PLATFORM } from 'aurelia-pal';
import { RouteConfig } from 'aurelia-router';

const meta = {
  prefix: 'customers',
  group: 'Customers'
}

export const generateCustomerRoutes = () =>  <RouteConfig[]>[
  <RouteConfig>{
    title: 'Customers',
    name: `${meta.prefix}/customer-list`,
    route: `${meta.prefix}/customer-list`,
    moduleId: PLATFORM.moduleName('./customers/customer-list'),
    nav: true,
    settings: {
      group: meta.group,
      icon: 'fa-users'
    }
  },
  <RouteConfig>{
    title: 'Customer',
    name: `${meta.prefix}/customer-form`,
    route: `${meta.prefix}/customer-form`,
    moduleId: PLATFORM.moduleName('./customers/customer-form'),
    nav: false
  }
];
