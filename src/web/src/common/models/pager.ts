import { appConfig } from '../../app-config';

type Param = {
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

  constructor(param: Param) {
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
