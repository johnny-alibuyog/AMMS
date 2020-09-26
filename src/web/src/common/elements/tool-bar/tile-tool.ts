import { bindable, customElement, inlineView } from "aurelia-framework";

import { ITool } from "./tool-bar";

@customElement("tile-tool")
@inlineView(`
<template>
  <i class="fas fa-grip-vertical tool__img" title="Grid View" click.delegate="notify()"></i>
</template>
`)
export class TileTool implements ITool {
  @bindable()
  public exec: () => void;

  public notify(): void {
    if (this.exec) {
      this.exec();
    }
  }
}
