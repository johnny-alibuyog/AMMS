import { customElement, inlineView, bindable } from "aurelia-framework";

@customElement("add-command")
@inlineView(`
<template>
  <i class="fas fa-plus command__img" click.delegate="notify()"></i>
</template>
`)
export class AddCommand implements ICommand {
  @bindable()
  public exec: () => void;

  public notify(): void {
    if (this.exec) {
      this.exec();
    }
  }
}
