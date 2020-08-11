import { appConfig } from '../../app-config';
import { isNotNullOrDefault } from 'common/utils';
import { isPropertyName } from 'typescript';
import { camelToTitle } from 'features/utils';

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

type SortItem = {
  key: string,
  label: string,
  field: string,
  value: SortDirection
}

export class Sorter<T> {

  public data: T; // JSON representation of sort data

  public items: SortItem[];

  public selectedItem: SortItem;

  constructor(param: Param<T>) {
    this.init = () => param.init();
    this.sort = () => param.action();
    this.set(this.init());
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
    this.populateItemsWith(this.data);
  }

  public doSort(target: keyof T): void {
    if (!this.sort) {
      return;
    }
    for (let [key, value] of Object.entries(this.data)) {
      // toggle sort, just sort only one field for now
      const getNewValue = (): SortDirection => {
        if (key !== target) {
          return 'none';
        }
        return value === 'asc' ? 'desc' : 'asc';
      };
      this.data[key] = getNewValue();
      if (key === target) {
        this.selectItem(target, this.data[key]);
      }
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

  private populateItemsWith(source: T): void {
    const directions: SortDirection[] = ['asc', 'desc'];
    this.items = Object.keys(source)
      .map(key => directions.map(value => ({
        key: `${key} - ${value}`,
        label: `${camelToTitle(key)} - ${camelToTitle(value)}`,
        field: key,
        value: value
      })))
      .flat();
    const [key, value] = Object.entries(source).find(([_, value]) => value != 'none');
    this.selectedItem = this.items.find(x => x.key == key && x.value == value);
  }

  private selectItem(key: keyof T, value: SortDirection): void {
    this.selectedItem = this.items.find(x => x.field === key && x.value == value);
  }

  public propagateSelected(item: SortItem): void {
    this.doSort(item.field as keyof T);
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
