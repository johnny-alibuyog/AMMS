import { autoinject } from 'aurelia-framework';
import { auth } from '../../features/membership/auth';

@autoinject()
export class AccountBar {
  public title = "title man";

  public logout(): void {
    auth.signout();
  }
}
