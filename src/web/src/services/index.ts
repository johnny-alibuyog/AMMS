import { RouterConfiguration, Router, RouteConfig } from "aurelia-router";
import { PLATFORM } from "aurelia-pal";

export class Index {
  public router: Router;

  public configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = "Services";
    config.map([
      ...repairRoutes({ group: "Repairs" }),
      ...customerRoutes({ group: "Customers" })
      // {
      //   route: '',
      //   redirect: 'diagnoses'
      // }
    ]);
  }
}

type Meta = { group: string };

const customerRoutes = (meta: Meta) =>
  <RouteConfig[]>[
    {
      title: "Customers",
      name: "customer-list",
      route: "customers/customer-list",
      moduleId: PLATFORM.moduleName("./customers/customer-list"),
      nav: true,
      settings: {
        group: meta.group
      }
    },
    {
      title: "Customer",
      name: "customer",
      route: "customers/customer",
      moduleId: PLATFORM.moduleName("./customers/customer"),
      nav: false,
      settings: {
        group: meta.group
      }
    }
  ];

const repairRoutes = (meta: Meta) =>
  <RouteConfig[]>[
    {
      title: "Diagnoses",
      route: ["", "diagnoses"],
      name: "repairs/diagnoses",
      moduleId: PLATFORM.moduleName("./repairs/diagnosis-list"),
      nav: true,
      settings: {
        group: meta.group
      }
    },
    {
      title: "Diagnosis",
      name: "diagnosis",
      route: "repairs/diagnosis",
      moduleId: PLATFORM.moduleName("./repairs/diagnosis"),
      nav: false,
      settings: {
        group: meta.group
      }
    },
    {
      title: "Quotations",
      name: "quotations",
      route: "repairs/quotations",
      moduleId: PLATFORM.moduleName("./repairs/quotation-list"),
      nav: true,
      settings: {
        group: meta.group
      }
    },
    {
      title: "Quotation",
      name: "quotation",
      route: "repairs/quotation",
      moduleId: PLATFORM.moduleName("./repairs/quotation"),
      nav: false,
      settings: {
        group: meta.group
      }
    },
    {
      title: "Job Orders",
      name: "job-orders",
      route: "repairs/job-orders",
      moduleId: PLATFORM.moduleName("./repairs/job-order-list"),
      nav: true,
      settings: {
        group: meta.group
      }
    },
    {
      title: "Job Order",
      name: "job-order",
      route: "repairs/job-order",
      moduleId: PLATFORM.moduleName("./repairs/job-order"),
      nav: false,
      settings: {
        group: meta.group
      }
    }
  ];
