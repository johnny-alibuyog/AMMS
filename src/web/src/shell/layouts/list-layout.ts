import { Filter, Pager, Sorter } from "common/services/pagination";
import { PageRequest, PageResponse } from "features/common/model";

import { ListPageState } from "kernel/state/models";
import { PromptService } from "common/elements/prompt/prompt-service";
import { Router } from 'aurelia-router';
import { Subscription } from "rxjs";
import { ToastService } from "common/elements/toast/toast-service";
import { UrlState } from "features/common/url.states";
import { autoinject } from 'aurelia-framework';
import { state } from "kernel/state";

export type Operations<TModel, TFilter, TSort> = {
  initSort: () => TSort,
  initFilter: () => TFilter,
  initData: () => Promise<void>,
  create?: () => Promise<void> | void | boolean,
  update?: (item: TModel) => Promise<void> | void | boolean,
  delete?: (item: TModel) => Promise<void> | void | boolean,
  dataSource: (request: PageRequest<TFilter, TSort>) => Promise<PageResponse<TModel>>
}

@autoinject()
export class ListLayout<TModel, TFilter, TSort> {
  private _activated: boolean = false;
  private readonly _url: UrlState
  private readonly _subscriptions: Subscription[] = [];
  protected operations: Operations<TModel, TFilter, TSort> = null;

  public title: string = "";
  public settings: ListPageState;
  public filter: Filter<TFilter>;
  public sorter: Sorter<TSort>;
  public pager: Pager<TModel>;

  constructor(
    protected readonly _router: Router,
    protected readonly _toast: ToastService,
    protected readonly _prompt: PromptService
  ) {
    this._url = new UrlState(this._router);
  }

  // NOTE: This should be placed in the constructor. but since aurelia 
  //  doesn't allow it, we extracted a method to initialize _operations
  protected setOperations(operations: Operations<TModel, TFilter, TSort>): void {
    this.operations = operations;
    this.filter = new Filter({
      init: () => this.operations.initFilter(),
      action: async () => {
        this.pager.page = 1;
        await this.paginate();
      }
    });
    this.sorter = new Sorter({
      init: () => this.operations.initSort(),
      action: () => this.paginate()
    });
    this.pager = new Pager({
      action: () => this.paginate()
    });
  }

  public async activate(param: PageRequest<TFilter, TSort>): Promise<void> {
    this.filter.set(param?.filter);
    this.sorter.set(param?.sort);
    this.pager.set({ page: param.page, size: param.size });
    await this.operations.initData();
    this._activated = true;
  }

  public async attached(): Promise<void> {
    this.settings = await state.listPage.current();
    this._subscriptions.push(state.listPage.state().subscribe(value => this.settings = value));
  }

  public detached(): void {
    this._subscriptions.forEach(x => x.unsubscribe());
  }

  public async resetPage(): Promise<void> {
    await this.activate({
      filter: this.operations.initFilter(),
      sort: this.operations.initSort(),
      page: null,
      size: null
    });
  }

  public async paginate(): Promise<void> {
    const request: PageRequest<TFilter, TSort> = {
      filter: this.filter.valueOf(),
      sort: this.sorter.valueOf(),
      page: this.pager.page,
      size: this.pager.size
    };
    const result = await this.operations.dataSource(request);
    this.pager.total = result.total;
    this.pager.items = result.items;
    if (this._activated) {
      this._url.rewrite(request);
    }
  }

  public toggleFilter(): void {
    this.settings.isFilterVisible = !this.settings.isFilterVisible;
    state.listPage.set(this.settings);
  }

  public setView(view: ListPageState['view']): void {
    this.settings.view = view;
    state.listPage.set(this.settings);
  }

  public create(): Promise<void> | void | boolean {
    if (this.operations.create == undefined) {
      throw new Error(`Create functionality is not yet defined for ${this.title}`);
    }
    return this.operations.create();
  }

  public update(item: TModel): Promise<void> | void | boolean {
    if (this.operations.update == undefined) {
      throw new Error(`Edit functionality is not yet defined for ${this.title}`);
    }
    return this.operations.update(item);
  }

  public delete(item: TModel): Promise<void> | void | boolean {
    if (this.operations.delete == undefined) {
      throw new Error(`Eelete functionality is not yet defined for ${this.title}`);
    }
    return this.operations?.delete(item);
  }
}
