import { View, ViewEngineHooks } from 'aurelia-framework';

import { Ownership } from 'features/common/ownership/ownership.model';
import { viewEngineHooks } from 'aurelia-templating';

// http://www.foursails.co/blog/template-constants/
@viewEngineHooks()
export class OwnershipBinder implements ViewEngineHooks {
  public beforeBind(view: View): void {
    view.overrideContext['Ownership'] = Ownership;
    view.overrideContext['Ownerships'] = Object.entries(Ownership).map(([_, value]) => value);
  }
}
