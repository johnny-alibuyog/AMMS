import { autoinject } from 'aurelia-framework';
import { authService } from '../../kernel/auth-service';

@autoinject()
export class AccountBar {
  public title = "title man";

  public logout(): void {
    authService.signout();
  }
}
