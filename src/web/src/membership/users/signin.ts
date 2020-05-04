import { autoinject } from 'aurelia-framework';
import { authService } from '../../kernel/auth-service';


@autoinject()
export class Login {
  public message: string = 'Login Man';

  public signin(): void {
    authService.signin();
  }
}
