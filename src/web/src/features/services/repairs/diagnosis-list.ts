import { UrlState } from 'features/common/url.states';
import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { PageResponse, PageRequest } from 'features/common/model';
import { Role } from 'features/membership/roles/role.models';
import { Filter, Sorter, Pager, SortDirection } from 'common/services/pagination';
import { UserFilter, UserSort, User, initFilter, initSort } from 'features/membership/users/user.models';

@autoinject
export class DiagnosisList {
  private readonly _url: UrlState;
  public title: string = "Diagnoses";
  public roles: string[] = ['user', 'admin'];
  public filter: Filter<UserFilter>;
  public sorter: Sorter<UserSort>;
  public pager: Pager<User>;

  constructor(private readonly _router: Router) {
    this._url = new UrlState(this._router);
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

  public activate(params: PageRequest<UserFilter, UserSort>): void {
    this.filter.set(params?.filter);
    this.sorter.set(params?.sort);
    this.pager.set({ page: params?.page, size: params.size });
    this.paginate();
  }

  public add(): void {
    this._router.navigateToRoute('repairs/diagnoses');
  }

  public edit(item: User): void {
    this._router.navigateToRoute('repairs/diagnosis', { id: item.id });
    alert(`edit: ${item.username}`);
  }

  public delete(item: User): void {
    alert(`delete: ${item.username}`);
  }

  public doFilter(): void {
    alert(`do filter man`);
  }

  public async paginate(): Promise<void> {
    const request = {
      filter: this.filter.valueOf(),
      sort: this.sorter.valueOf(),
      page: this.pager.page,
      size: this.pager.size
    };
    const result = await paginate(request);
    this.pager.total = result.total;
    this.pager.items = result.items;
    this._url.rewrite(request);
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

function paginate(page: PageRequest<UserFilter, UserSort>): Promise<PageResponse<User>> {
  const [sortField, sortDirection] = Object.entries(page.sort)
    .find(([_, value]) => value != 'none');

  const query = data.filter(x =>
    x.username.includes(page.filter?.keyword || '') ||
    x.person.firstName.includes(page.filter?.keyword || '') ||
    x.person.middleName?.includes(page.filter?.keyword || '') ||
    x.person.lastName.includes(page.filter?.keyword || '')
  );

  const items = query
    .sort(sortBy(sortField, sortDirection))
    .slice((page.page - 1) * page.size, page.page * page.size);

  const total = query.length;

  return Promise.resolve({ total, items });
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
