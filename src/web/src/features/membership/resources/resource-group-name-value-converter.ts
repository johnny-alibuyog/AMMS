import { data } from "./resource.data";

export class ResourceGroupNameValueConverter {
  public toView(id: string) {
    return data?.find(x => x.id == id)?.group;
  }
}
