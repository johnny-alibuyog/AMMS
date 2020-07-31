import { Filter, Pager, Sorter } from 'common/services/pagination';
import { Lookup, PageRequest } from 'features/common/model';
import { User, UserFilter, UserSort, initFilter, initSort } from './user.models';

import { RoleId } from '../roles/role.models';
import { Router } from 'aurelia-router';
import { UrlState } from 'features/common/url.states';
import { api } from 'features/api';
import { autoinject } from 'aurelia-framework';

@autoinject
export class UserList {
  private readonly _url: UrlState
  private _activated: boolean = false ;
  public title: string = "Users";
  public view: 'list' | 'tile' = 'list';
  public roles: Lookup[] = [];
  public filter: Filter<UserFilter>;
  public sorter: Sorter<UserSort>;
  public pager: Pager<User>;

  constructor(private readonly _router: Router) {
    this.init();
    this._url = new UrlState(this._router);
  }

  public setView(value: UserList['view']) {
    this.view = value;
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

  public async activate(param: PageRequest<UserFilter, UserSort>): Promise<void> {
    this.filter.set(param?.filter);
    this.sorter.set(param?.sort);
    this.pager.set({ page: param.page, size: param.size });

    [this.roles] = await Promise.all([
      api.roles.lookup(),
      this.paginate()
    ]);

    this._activated = true;
  }

  public add(): void {
    this._router.navigateToRoute('users/user-form');
  }

  public edit(item: User): void {
    this._router.navigateToRoute('users/user-form', { id: item.id });
  }

  public delete(item: User): void {
    alert(`delete: ${item.username}`);
  }

  public doFilter(): void {
    alert(`do filter man`);
  }

  public toName(id: RoleId) {
    const role = this.roles.find(x => x.id == id);
    return role?.name;
  }

  public async paginate(): Promise<void> {
    const request: PageRequest<UserFilter, UserSort> = {
      filter: this.filter.valueOf(),
      sort: this.sorter.valueOf(),
      page: this.pager.page,
      size: this.pager.size
    };
    const result = await api.users.find(request);
    this.pager.total = result.total;
    this.pager.items = result.items;
    if (this._activated) {
      this._url.rewrite(request);
    }
  }

  public async reset(): Promise<void> {
    this.init();
    await this.paginate();
  }
}
