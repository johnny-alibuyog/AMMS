import { Branch, BranchFilter, BranchSort, initFilter, initSort } from './branch.models';

import { ListLayout } from 'shell/layouts/list-layout';
import { PromptService } from 'common/elements/prompt/prompt-service';
import { Router } from 'aurelia-router';
import { ToastService } from 'common/elements/toast/toast-service';
import { api } from 'features/api';
import { autoinject } from 'aurelia-framework';

@autoinject()
export class BranchList extends ListLayout<Branch, BranchFilter, BranchSort> {
 
  constructor(
    router: Router,
    toast: ToastService,
    prompt: PromptService
  ) {
    super(router, toast, prompt)
    this.title = 'Branches';
    this.setOperations({
      initSort: () => initSort(),
      initFilter: () => initFilter(),
      loadData: () => this.paginate(),
      add: () => router.navigateToRoute('branches/role-form'),
      edit: (item) => router.navigateToRoute('branches/role-form', { id: item.id }),
      dataSource: (request) => api.branches.find(request)
    });
  }

  public async toggleActiveStatus(item: Branch): Promise<void> {
    const promptResult = item.active
      ? await this._prompt.deactivate('Deactivate Branch', `Do you want to deactivate ${item.name}?`)
      : await this._prompt.activate('Activate Branch', `Do you want to activate ${item.name}?`);
    if (!promptResult) {
      return;
    }
    await api.branches.patch(item.id, { active: !item.active });
    item.active = !item.active;
    const message = `${item.name} has been ${item.active ? 'activated' : 'deactivated'}.`;
    await this._toast.success(message, 'Successful');
  }
}