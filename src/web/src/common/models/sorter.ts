import { Dictionary } from '../custom-types/Dictionary';

type Param = { 
  fields: Dictionary<any>, 
  action: () => void 
}

export class Sorter implements Dictionary<any> {
  [key: string]: any;

  constructor(param: Param ){
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
