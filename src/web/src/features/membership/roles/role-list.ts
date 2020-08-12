import { Role, RoleFilter, RoleSort, initFilter, initSort } from './role.models';

import { ListLayout } from 'shell/layouts/list-layout';
import { PromptService } from 'common/elements/prompt/prompt-service';
import { Router } from 'aurelia-router';
import { ToastService } from 'common/elements/toast/toast-service';
import { api } from 'features/api';
import { autoinject } from 'aurelia-framework';

@autoinject()
export class RoleList extends ListLayout<Role, RoleFilter, RoleSort> {

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
      initData: () => this.paginate(),
      create: () => router.navigateToRoute('roles/role-form'),
      update: (item) => router.navigateToRoute('roles/role-form', { id: item.id }),
      dataSource: (request) => api.roles.find(request)
    });
  }

  public async toggleActiveStatus(item: Role): Promise<void> {
    const promptResult = item.active
      ? await this._prompt.deactivate('Deactivate Role', `Do you want to deactivate ${item.name}?`)
      : await this._prompt.activate('Activate Role', `Do you want to activate ${item.name}?`);
    if (!promptResult) {
      return;
    }
    await api.roles.patch(item.id, { active: !item.active });
    item.active = !item.active;
    const message = `${item.name} has been ${item.active ? 'activated' : 'deactivated'}.`;
    await this._toast.success(message, 'Successful');
  }
}