import { data } from "./resource.data";

export class ResourceNameValueConverter {
  public toView(id: string) {
    return data?.find(x => x.id == id)?.name;
  }
}
