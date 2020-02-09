import { autoinject, bindable } from 'aurelia-framework';
import { Router } from 'aurelia-router';


/*
 * this breadcurmbs is based on the route
 */
@autoinject()
export class CustomBreadcrumbs {

  @bindable()
  public items: BreadcrumbItem[]
}

export interface BreadcrumbItem {
  title: string,
  url: string,
}
