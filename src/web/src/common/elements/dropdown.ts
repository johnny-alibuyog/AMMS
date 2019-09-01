import * as KeyCode from "keycode-js";
import { replaceElementWithTemplate } from "./content-processors";
import {
  autoinject,
  customElement,
  inlineView,
  processContent
} from "aurelia-framework";

//const KeyCode = require('keycode-js');
// use replaceable parts | slots
// https://aurelia.io/docs/templating/content-projection#introduction
// http://www.foursails.co/blog/semantic-template-parts/
// https://ilikekillnerds.com/2019/04/masked-inputs-in-aurelia-the-easy-and-reliable-way/
// https://github.com/aurelia/documentation/blob/master/current/en-us/5.%20templating/4.%20custom-elements.md
// https://stackoverflow.com/questions/43306744/using-custom-element-content-as-item-template?answertab=votes#tab-top

type Model = {
  isFocused: boolean;
  isOpen: boolean;
};

@autoinject()
@customElement("dropdown")
@processContent(replaceElementWithTemplate(["target", "content"]))
export class Dropdown {
  public state: Model = {
    isFocused: false,
    isOpen: false
  };

  private handleKeyInput = (event: KeyboardEvent) => {
    if (this.state.isOpen && event.keyCode === KeyCode.KEY_ESCAPE) {
      this.state.isOpen = false;
    }
  };

  public attached(): void {
    window.addEventListener("keydown", this.handleKeyInput, false);
  }

  public dettached(): void {
    window.removeEventListener("keydown", this.handleKeyInput);
  }
}

@customElement("target")
@inlineView("<template><slot></slot></template>")
export class Target {}

@customElement("content")
@inlineView("<template><slot></slot></template>")
export class Content {}
