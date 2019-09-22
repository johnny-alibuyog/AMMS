import { customElement, inlineView, bindable } from "aurelia-framework";

@customElement("tile-command")
@inlineView(`
<template>
  <i class="fas fa-grip-vertical command__img" click.delegate="notify()"></i>
</template>
`)
export class TileCommand implements ICommand {
  @bindable()
  public exec: () => void;

  public notify(): void {
    if (this.exec) {
      this.exec();
    }
  }
}
