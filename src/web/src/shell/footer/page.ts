import {
  autoinject,
  inlineView,
  child,
  customElement
} from "aurelia-framework";

@autoinject()
@customElement("pager")
@inlineView("<template><slot></slot></template>")
export class Pager {}

@autoinject()
@customElement("content")
@inlineView("<template><slot></slot></template>")
export class Content {}

@customElement("page")
export class Page {
  public something1: string = "something1";
  public something2: string = "something2";

  @child("pager")
  public pager: Pager = new Pager();

  @child("content")
  public content: Content = new Content();

  constructor(private element: Element) {}
}
