import { customElement, inlineView, bindable } from "aurelia-framework";
import { ITool } from "./tool-bar";

@customElement("add-tool")
@inlineView(`
<template>
  <i class="fas fa-plus tool__img" click.delegate="notify()"></i>
</template>
`)
export class AddTool implements ITool {
  @bindable()
  public exec: () => void;

  public notify(): void {
    if (this.exec) {
      this.exec();
    }
  }
}