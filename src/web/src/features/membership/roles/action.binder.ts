import { View, ViewEngineHooks } from 'aurelia-framework';

import { Action } from './role.models';
import { viewEngineHooks } from 'aurelia-templating';

// http://www.foursails.co/blog/template-constants/
@viewEngineHooks()
export class ActionBinder implements ViewEngineHooks {
  public beforeBind(view: View): void {
    view.overrideContext['Action'] = Action;
    view.overrideContext['Actions'] = Object.entries(Action)
      .filter(([_, value]) => value !== Action.all)
      .map(([_, value]) => value);
  }
}
