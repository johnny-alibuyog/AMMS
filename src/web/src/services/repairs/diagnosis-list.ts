import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { Filter, Sorter, Pager, SortDirection } from 'common/services/pagination';

type User = {
  name: string,
  email: string,
  role: string,
}

@autoinject
export class DiagnosisList {
  public title: string = "Diagnoses";
  public roles: string[] = ['user', 'admin'];
  public filter: Filter;
  public sorter: Sorter;
  public pager: Pager<User>;

  constructor(
    private readonly _router: Router,
  ) {
    this.filter = new Filter({
      fields: {
        name: '',
        email: '',
        role: ''
      },
      action: () => this.paginate()
    });

    this.sorter = new Sorter({
      fields: {
        name: SortDirection.Ascending,
        email: SortDirection.None,
        role: SortDirection.None
      },
      action: () => this.paginate()
    });

    this.pager = new Pager({ action: () => this.paginate() });
  }

  public activate(): void {
    this.paginate();
  }

  public add(): void {
    this._router.navigateToRoute('repairs/diagnosis');
  }

  public edit(item: User): void {
    alert(`edit: ${item.name}`);
  }

  public delete(item: User): void {
    alert(`delete: ${item.name}`);
  }

  public doFilter(): void {
    alert(`do filter man`);
  }

  public paginate(): void {
    const result = paginate(this.pager.offset, this.pager.size);
    this.pager.count = result.count;
    this.pager.items = result.items;
  }
}

const data: User[] = Array(45)
  .fill(null)
  .map((value, index) => <User>{
    name: `name_${index}`,
    email: `name_${index}@g.com`,
    role: 'admin'
  });

function paginate(offset: number, size: number) {
  return {
    count: data.length,
    items: data.slice((offset - 1) * size, offset * size)
  };
}
