import { Filter } from '../../common/models/filter';
import { Sorter, SortDirection } from '../../common/models/sorter';
import { Pager } from '../../common/models/pager';
// import {
//   ActionCommand,
//   MenuCommand,
//   MenuCommandItem
// } from "./../../shell/layouts/list-layout-commands";
// import { Command } from "../../shell/layouts/list-layout-commands";

type User = {
  name: string,
  email: string,
  role: string,
}

export class DiagnosisList {
  public title: string = "Diagnoses";

  public roles: string[] = ['user', 'admin'];

  public filter: Filter;

  public sorter: Sorter;

  public pager: Pager<User>;

  constructor() {
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
    alert("add");
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


  // public commands: Command[] = [
  //   <ActionCommand>{
  //     icon: 'add',
  //     action: () => alert('add')
  //   },
  //   <MenuCommand>{
  //     icon: 'more',
  //     commands: [
  //       <MenuCommandItem>{
  //         title: 'Hello',
  //         action: () => alert('Hello')
  //       }
  //     ]
  //   }
  // ];
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
