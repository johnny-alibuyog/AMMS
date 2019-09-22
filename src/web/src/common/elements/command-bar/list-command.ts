import { customElement, inlineView, bindable } from "aurelia-framework";

@customElement("list-command")
@inlineView(`
<template>
  <i class="fas fa-list command__img" click.delegate="notify()"></i>
</template>
`)
export class ListCommand implements ICommand {
  @bindable()
  public exec: () => void;

  public notify(): void {
    if (this.exec) {
      this.exec();
    }
  }
}
