import { customElement, inlineView, bindable } from "aurelia-framework";

@customElement("command-bar")
export class CommandBar {}

interface ICommand {
  exec: () => void;
  notify(): void;
}

@customElement("add-command")
@inlineView(`
<template>
  <i class="fas fa-plus" click.delegate="notify()"></i>
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

@customElement("list-command")
@inlineView(`
<template>
  <i class="fas fa-list" click.delegate="notify()"></i>
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

@customElement("tile-command")
@inlineView(`
<template>
  <i class="fas fa-grip-vertical" click.delegate="notify()"></i>
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

@customElement("menu-command")
@inlineView(`
<template>
  <dropdown view-model.ref="dropdownRef">
    <target>
      <i class="fas fa-ellipsis-v""></i>
    </target>
    <content>
      <slot></slot>
    </content>
  </dropdown>

</template>
`)
export class MenuCommand implements ICommand {
  @bindable()
  public exec: () => void;

  public notify(): void {
    if (this.exec) {
      this.exec();
    }
  }
}
