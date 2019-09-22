import {
  bindable,
  customElement,
  inlineView,
  autoinject
} from "aurelia-framework";

@customElement("menu-command")
export class MenuCommand {
  public state = {
    isOpen: false
  };

  public toggleMenu(): void {
    this.state.isOpen = !this.state.isOpen;
  }
}

@autoinject()
@customElement("menu-command-item")
@inlineView(`
<template>
  <slot></slot>
</template>
`)
export class MenuCommandItem implements ICommand {
  private readonly _element: HTMLElement;

  @bindable()
  public exec: () => void;

  public notify(): void {
    if (this.exec) {
      this.exec();
    }
  }

  constructor(element: Element) {
    this._element = element as HTMLElement;
  }

  public attached(): void {
    this._element.onclick = ev => {
      this.notify();
      return true;
    };
  }
}
