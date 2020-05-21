import { appConfig } from '../../app-config';

type Param<T> = {
  data: T,
  action: () => Promise<void>
}

export class Filter<T> {
  public data: T;

  constructor(param: Param<T>) {
    this.data = param.data;
    this.filter = () => param.action();
  }

  public filter: () => Promise<void>;

  public doFilter(): void {
    if (!this.filter)
      return;

    this.filter();
  }
}

export class Sorter<T> {
  public data: T;

  constructor(param: Param<T>) {
    this.data = param.data;
    this.sort = () => param.action();
  }

  public sort: () => Promise<void>;

  public doSort(field: keyof T): void {
    if (!this.sort) {
      return;
    }

    // toggle sort, just sort only one field for now
    for (let key of Object.keys(this.data)) {
      const currentSort: SortDirection = this.data[key.valueOf()];
      const newSort: SortDirection = (() => {
        if (key === field) {
          return currentSort === 'asc' ? 'desc' : 'asc';
        }
        else {
          return 'none';
        }
      })();
      this.data[key.valueOf()] = newSort;
    }

    this.sort();
  }

  public class(direction: SortDirection): string {
    switch (direction) {
      case 'asc': return 'fas fa-fw fa-sort-up';
      case 'desc': return 'fas fa-fw fa-sort-down';
      default: return 'fas fa-fw fa-sort';
    }
  }
}

export type SortDirection = 'asc' | 'desc' | 'none';

type PagerParam = {
  config?: {
    pageSize: number
  },
  action: () => Promise<void>
}

export class Pager<T> {
  public page: number;
  public size: number;
  public total: number;
  public items: T[];

  public get start(): number {
    return ((this.page - 1) * this.size);
  }

  public get end(): number {
    return (this.start + this.size);
  }

  public paginate: () => Promise<void>;

  constructor(param: PagerParam) {
    this.page = 1;
    this.size = param?.config?.pageSize || appConfig.page.pageSize;
    this.paginate = () => param.action();
  }

  public clear(): void {
    this.items = [];
    this.total = 0;
  }

  public async doPage(event: CustomEvent): Promise<void> {
    const pageNumber = <number>event.detail.pageNumber;
    if (this.page === pageNumber)
      return;

    this.page = pageNumber;

    if (!this.paginate)
      return;

    await this.paginate();
  }
}
