import { Branch, BranchFilter, BranchId, BranchSort, initFilter, initSort } from './branch.models';
import { Filter, Pager, Sorter } from 'common/services/pagination';

import { PageRequest } from 'features/common/model';
import { PromptService } from 'common/elements/prompt/prompt-service';
import { Router } from 'aurelia-router';
import { ToastService } from 'common/elements/toast/toast-service';
import { UrlState } from 'features/common/url.states';
import { api } from 'features/api';
import { autoinject } from 'aurelia-framework';

@autoinject()
export class BranchList {
  private readonly _url: UrlState
  private _activated: boolean = false;
  public title: string = 'Branches';
  public view: 'list' | 'tile' = 'list';
  public filter: Filter<BranchFilter>;
  public sorter: Sorter<BranchSort>;
  public pager: Pager<Branch>;

  constructor(
    private readonly _router: Router,
    private readonly _toast: ToastService,
    private readonly _prompt: PromptService
  ) {
    this.init();
    this._url = new UrlState(this._router);
  }

  private init(): void {
    this.filter = new Filter({
      init: () => initFilter(),
      action: () => this.paginate()
    });
    this.sorter = new Sorter({
      init: () => initSort(),
      action: () => this.paginate()
    });
    this.pager = new Pager({
      action: () => this.paginate()
    });
  }

  public async activate(param: PageRequest<BranchFilter, BranchSort>): Promise<void> {
    this.filter.set(param?.filter);
    this.sorter.set(param?.sort);
    this.pager.set({ page: param.page, size: param.size });
    await this.paginate();
    this._activated = true;
  }

  public add(): void {
    this._router.navigateToRoute('branches/branch-form');
  }

  public edit(item: Branch): void {
    this._router.navigateToRoute('branches/branch-form', { id: item.id });
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

  public async paginate(): Promise<void> {
    const request: PageRequest<BranchFilter, BranchSort> = {
      filter: this.filter.valueOf(),
      sort: this.sorter.valueOf(),
      page: this.pager.page,
      size: this.pager.size
    };
    const result = await api.branches.find(request);
    this.pager.total = result.total;
    this.pager.items = result.items;
    if (this._activated) {
      this._url.rewrite(request);
    }
  }
}