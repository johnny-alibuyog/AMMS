import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { User, UserFilter, UserSort, initFilter, initSort } from './user.models';
import { Filter, Sorter, Pager } from 'common/services/pagination';
import { api } from 'features/api';
import { Lookup } from 'features/common/model';
import { RoleId } from '../roles/role.models';

@autoinject
export class UserList {
  public title: string = "Users";
  public roles: Lookup[];
  public filter: Filter<UserFilter>;
  public sorter: Sorter<UserSort>;
  public pager: Pager<User>;

  constructor(private readonly _router: Router) {
    this.init();
  }

  private init(roles: RoleId[] = []): void {
    this.filter = new Filter({
      data: initFilter(roles),
      action: () => this.paginate()
    });
    this.sorter = new Sorter({
      data: initSort(),
      action: () => this.paginate()
    });
    this.pager = new Pager({
      action: () => this.paginate()
    });
  }

  public async activate(): Promise<void> {
    this.roles = await api.roles.lookup();
    this.init(this.roles?.map(x => x.id) ?? []);
    await this.paginate();
  }

  public add(): void {
    this._router.navigateToRoute('users/user-form');
  }

  public edit(item: User): void {
    this._router.navigateToRoute('users/user-form', { id: item.id });
    alert(`edit: ${item.username}`);
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
    const result = await api.users.find({
      filter: this.filter.data, 
      sort: this.sorter.data, 
      page: this.pager.page, 
      size: this.pager.size
    });
    this.pager.total = result.total;
    this.pager.items = result.items;
  }

  public async reset(): Promise<void> {
    this.init(this.roles?.map(x => x.id) ?? []);
    await this.paginate();
  }
}

