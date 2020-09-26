import { View, ViewEngineHooks } from 'aurelia-framework';

import { ResourceGroup } from './resource.model';
import { viewEngineHooks } from 'aurelia-templating';

// http://www.foursails.co/blog/template-constants/
@viewEngineHooks()
export class ResourceGroupBinder implements ViewEngineHooks {
  public beforeBind(view: View): void {
    view.overrideContext['ResourceGroup'] = ResourceGroup;
    view.overrideContext['ResourceGroups'] = Object.entries(ResourceGroup)
    .filter(([_, value]) => value !== ResourceGroup.all)
    .map(([_, value]) => value);
  }
}
