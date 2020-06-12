import { Router } from 'aurelia-router';

/*
 * This is a helper class that will rewrite the Url (query string) but will not load the 
 * whole page. It is useful specially when you need to store the state of a page and able 
 * to restore the state on refresh. Ex. When a page is using pagination, this will capture 
 * the state of the page on multiple events (change of page/filter/sort) and will be able 
 * to restore the state based on the query string of the url.
 * 
 * Reference
 * https://stackoverflow.com/questions/30852727/how-do-i-set-read-a-query-string-when-using-the-router-in-aurelia
 * https://stackoverflow.com/questions/39244796/aurelia-router-modify-route-params-and-address-bar-from-vm-with-router
 */
export class UrlState {
  constructor(private readonly router: Router) { }

  public rewrite<T>(params: T): void {
    const route = this.router?.currentInstruction?.config?.name;
    const options = { trigger: false, replace: true };
    if (route) {
      this.router.navigateToRoute(route, params, options);
    }
  }
}
