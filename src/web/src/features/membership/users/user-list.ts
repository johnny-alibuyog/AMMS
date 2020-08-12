import { User, UserFilter, UserSort, initFilter, initSort } from './user.models';

import { ListLayout } from 'shell/layouts/list-layout';
import { Lookup } from 'features/common/model';
import { PromptService } from 'common/elements/prompt/prompt-service';
import { Router } from 'aurelia-router';
import { ToastService } from 'common/elements/toast/toast-service';
import { api } from 'features/api';
import { autoinject } from 'aurelia-framework';

@autoinject
export class UserList extends ListLayout<User, UserFilter, UserSort> {
  public roles: Lookup[] = [];
  public branches: Lookup[] = [];

  constructor(
    router: Router,
    toast: ToastService,
    prompt: PromptService
  ) {
    super(router, toast, prompt)
    this.title = 'Roles';
    this.setOperations({
      initSort: () => initSort(),
      initFilter: () => initFilter(),
      initData: async () => {
        [this.roles, this.branches] = await Promise.all([
          api.roles.lookup(),
          api.branches.lookup(),
          this.paginate()
        ]);
      },
      create: () => router.navigateToRoute('users/user-form'),
      update: (item) => router.navigateToRoute('users/user-form', { id: item.id }),
      dataSource: (request) => api.users.find(request)
    });
  }
}
