import { bindable, customElement, inlineView, autoinject } from "aurelia-framework";
import { ITool } from "./tool-bar";

@customElement("dropdown-menu-tool")
export class DropdownMenuTool {
  public state = {
    isOpen: false
  };

  public toggleMenu(): void {
    this.state.isOpen = !this.state.isOpen;
  }
}

@autoinject()
@customElement("dropdown-menu-tool-item")
@inlineView(`
<template>
  <slot></slot>
</template>
`)
export class DropdownMenuToolItem implements ITool {
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
