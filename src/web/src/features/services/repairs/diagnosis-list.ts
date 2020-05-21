import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { PageResponse } from 'features/common/model';
import { Role } from 'features/membership/roles/role.models';
import { Filter, Sorter, Pager, SortDirection } from 'common/services/pagination';
import { UserFilter, UserSort, User, initFilter, initSort } from 'features/membership/users/user.models';

@autoinject
export class DiagnosisList {
  public title: string = "Diagnoses";
  public roles: string[] = ['user', 'admin'];
  public filter: Filter<UserFilter>;
  public sorter: Sorter<UserSort>;
  public pager: Pager<User>;

  constructor(private readonly _router: Router) {
    this.filter = new Filter({
      data: initFilter(),
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

  public activate(): void {
    this.paginate();
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

  public async paginate(): Promise<void> {
    const result = await paginate({
      filter: this.filter.data,
      sort: this.sorter.data,
      offset: this.pager.page,
      size: this.pager.size
    });
    this.pager.total = result.total;
    this.pager.items = result.items;
  }
}

const data: User[] = Array(45)
  .fill(null)
  .map((value, index) => <User>{
    id: `id${index}`,
    username: `username${index}`,
    email: `email${index}@g.com`,
    person: {
      firstName: `firstname${index}`,
      middleName: `middlename${index}`,
      lastName: `lastname${index}`
    },
    roles: <Role[]>[]
  });

function paginate(page: { filter: UserFilter, sort: UserSort, offset: number, size: number }): Promise<PageResponse<User>> {
  const [sortField, sortDirection] = Object.entries(page.sort)
    .find(([key, value]) => value != 'none');

  return Promise.resolve({
    total: data.length,
    items: data
      // .filter(x =>
      //   x.username.includes(page.filter.keyword) ||
      //   x.person.firstName.includes(page.filter.keyword) ||
      //   x.person.middleName?.includes(page.filter.keyword) ||
      //   x.person.lastName.includes(page.filter.keyword)
      // )
      .sort(sortBy(sortField, sortDirection))
      .slice((page.offset - 1) * page.size, page.offset * page.size)
  });
}

function sortBy<T>(propName: string, direction: SortDirection) {
  return function apply(a: T, b: T) {
    if (a[propName] < b[propName])
      return direction == 'asc' ? -1 : 1;
    if (a[propName] > b[propName])
      return direction == 'desc' ? 1 : -1;
    return 0;
  }
}
