import { bindable, customElement, inlineView } from "aurelia-framework";

import { ITool } from "./tool-bar";

@customElement("list-tool")
@inlineView(`
<template>
  <i class="fas fa-list tool__img" title="List View" click.delegate="notify()"></i>
</template>
`)
export class ListTool implements ITool {
  @bindable()
  public exec: () => void;

  public notify(): void {
    if (this.exec) {
      this.exec();
    }
  }
}
