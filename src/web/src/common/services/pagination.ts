import { appConfig } from '../../app-config';
import { isNotNullOrDefault } from 'common/utils';

type Param<T> = {
  init: () => T,
  action: () => Promise<void>
}

export class Filter<T> {
  public data: T;

  constructor(param: Param<T>) {
    this.init = () => param.init();
    this.filter = () => param.action();
    this.data = this.init();
  }

  public valueOf = (): T => {
    return Object.entries(this.data)
      .filter(([_, value]) => isNotNullOrDefault(value))
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {}) as T;
  }

  public init: () => T;

  public filter: () => Promise<void>;

  public set(value?: Partial<T>) {
    if (!value) {
      return;
    }

    this.data = Object.assign(this.init(), value);
  }

  public doFilter(): void {
    if (!this.filter)
      return;

    this.filter();
  }
}

export class Sorter<T> {
  public data: T;

  constructor(param: Param<T>) {
    this.init = () => param.init();
    this.sort = () => param.action();
    this.data = this.init();
  }

  public valueOf = (): T => {
    return Object.entries(this.data)
      .filter(([_, value]) => value != <SortDirection>'none')
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {}) as T;
  }

  public init: () => T;

  public sort: () => Promise<void>;

  public set(value?: Partial<T>) {
    if (!value) {
      return;
    }

    this.data = Object.assign(this.init(), value);
  }

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
    this.set({
      page: 1,
      size: param?.config?.pageSize
    });
    this.paginate = () => param.action();
  }

  public set(value: { page: number, size: number }) {
    this.page = value?.page ?? 1;
    this.size = value?.size || appConfig.page.pageSize;

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
