import { PLATFORM } from 'aurelia-pal';
import { RouteConfig } from 'aurelia-router';

const meta = {
  prefix: 'repairs',
  group: 'Repairs'
}

export const generateRapairRoutes = () => <RouteConfig[]>[
  {
    title: 'Diagnoses',
    route: `${meta.prefix}/diagnoses`,
    name: `${meta.prefix}/diagnoses`,
    moduleId: PLATFORM.moduleName('./repairs/diagnosis-list'),
    nav: true,
    settings: {
      group: `${meta.group}`,
      icon: 'fa-tasks'
    }
  },
  {
    title: 'Diagnosis',
    name: `${meta.prefix}/diagnosis`,
    route: `${meta.prefix}/diagnosis`,
    moduleId: PLATFORM.moduleName('./repairs/diagnosis-form'),
    nav: false,
  },
  {
    title: 'Quotations',
    name: `${meta.prefix}/quotations`,
    route: `${meta.prefix}/quotations`,
    moduleId: PLATFORM.moduleName('./repairs/quotation-list'),
    nav: true,
    settings: {
      group: `${meta.group}`,
      icon: 'fa-calculator'
    }
  },
  {
    title: 'Quotation',
    name: `${meta.prefix}/quotation`,
    route: `${meta.prefix}/quotation`,
    moduleId: PLATFORM.moduleName('./repairs/quotation-form'),
    nav: false
  },
  {
    title: 'Job Orders',
    name: `${meta.prefix}/job-orders`,
    route: `${meta.prefix}/job-orders`,
    moduleId: PLATFORM.moduleName('./repairs/job-order-list'),
    nav: true,
    settings: {
      group: `${meta.group}`,
      icon: 'fa-wrench'
    }
  },
  {
    title: 'Job Order',
    name: `${meta.prefix}/job-order`,
    route: `${meta.prefix}/job-order`,
    moduleId: PLATFORM.moduleName('./repairs/job-order-form'),
    nav: false
  },
  {
    route: '',
    redirect: 'repairs/diagnoses'
  }
];
