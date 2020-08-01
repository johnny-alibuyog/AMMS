import { Image } from '../../features/common/images/image.models';
import { UserState } from 'kernel/state/models';
import { api } from 'features/api';
import { auth } from '../../features/membership/auth';
import { autoinject } from 'aurelia-framework';
import { state } from 'kernel/state';
import { Subscription } from 'rxjs';

@autoinject()
export class AccountBar {
  public title = "title man";
  public photo: Image = null;
  private _subscription: Subscription;

  public logout(): void {
    auth.signout();
  }

  public attached(): void {
    this._subscription = state.user.state().subscribe(this.resolvePhoto);
  }

  public detached(): void {
    this._subscription.unsubscribe();
  }

  private resolvePhoto = async (userState: UserState): Promise<void> => {
    if (!userState) {
      return;
    }
    const user = await api.users.get(userState.id);
    this.photo = await ((user.photo)
      ? api.images.get(user.photo as string)
      : Promise.resolve(<Image>null)
    );
  }
}
