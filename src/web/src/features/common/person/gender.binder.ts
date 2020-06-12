import { viewEngineHooks } from 'aurelia-templating';
import { ViewEngineHooks, View } from 'aurelia-framework';
import { Gender } from './person.address';

// http://www.foursails.co/blog/template-constants/
@viewEngineHooks()
export class GenderBinder implements ViewEngineHooks {
  public beforeBind(view: View): void {
    view.overrideContext['Gender'] = Gender;
    view.overrideContext['Genders'] = Object.entries(Gender).map(([_, value]) => value);
  }
}
