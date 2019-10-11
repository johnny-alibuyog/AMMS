import { Dictionary } from '../custom-types/dictionary';

type Param = { 
  fields: Dictionary<any>, 
  action: () => void 
}

export class Filter implements Dictionary<any> {
  [key: string]: any;

  constructor(param: Param ){
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
