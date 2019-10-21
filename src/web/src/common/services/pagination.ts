import { Dictionary } from '../custom-types/dictionary';
import { appConfig } from '../../app-config';

type Param = {
  fields: Dictionary<any>,
  action: () => void
}

export class Filter implements Dictionary<any> {
  [key: string]: any;

  constructor(param: Param) {
    for (const key in param.fields) {
      this[key] = param.fields[key];
    }

    this.filter = () => param.action();
  }

  public filter: () => void;

  public doFilter(): void {
    if (!this.filter)
      return;

    this.filter();
  }
}

export class Sorter implements Dictionary<any> {
  [key: string]: any;

  constructor(param: Param) {
    for (const key in param.fields) {
      this[key] = param.fields[key];
    }

    this.sort = () => param.action();
  }

  public sort: () => void;

  public doSort(field: string): void {
    if (!this.sort) {
      return;
    }

    // just sort only one field for now
    for (const key in this) {
      if (typeof this[key] === 'function') {
        continue;
      }

      if (key === field) {
        this[key.valueOf()] = this[field] == SortDirection.Ascending
          ? SortDirection.Descending
          : SortDirection.Ascending
      }
      else {
        this[key.valueOf()] = SortDirection.None;
      }
    }

    this.sort();
  }

  public class(direction: SortDirection): string {
    switch (direction) {
      case SortDirection.Ascending: return 'fas fa-fw fa-sort-up';
      case SortDirection.Descending: return 'fas fa-fw fa-sort-down';
      default: return 'fas fa-fw fa-sort';
    }
  }
}

export enum SortDirection {
  None = 0,
  Ascending = 1,
  Descending = 2
}


type PagerParam = {
  config?: {
    pageSize: number
  },
  action: () => void
}

export class Pager<T> {
  public offset: number;
  public size: number;
  public count: number;
  public items: T[];

  public get start(): number {
    return ((this.offset - 1) * this.size);
  }

  public get end(): number {
    return (this.start + this.size);
  }

  public paginate: () => void;

  constructor(param: PagerParam) {
    this.offset = 1;
    this.size = param.config && param.config.pageSize || appConfig.page.pageSize;
    this.paginate = () => param.action();
  }

  public clear(): void {
    this.items = [];
    this.count = 0;
  }

  public doPage(event: CustomEvent): void {
    const pageNumber = <number>event.detail.pageNumber;
    if (this.offset === pageNumber)
      return;

    this.offset = pageNumber;

    if (!this.paginate)
      return;

    this.paginate();
  }
}
