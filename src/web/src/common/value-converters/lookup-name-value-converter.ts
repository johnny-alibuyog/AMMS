import { Lookup } from "features/common/model";

export class LookupNameValueConverter {
  public toView(id: string, items: Lookup[]) {
    return items?.find(x => x.id == id)?.name;
  }
}
