import { customElement, inlineView, bindable } from "aurelia-framework";

export interface ITool {
  exec: () => void;
  notify(): void;
}

@customElement("tool-bar")
export class ToolBar {}

/*
@customElement("menu-command")
@inlineView(`
<template>
  <div>
    <div class="menu-command__icon" click.delegate="alertMe()">
      <i class="fas fa-ellipsis-v command__img""></i>
    </div>
    <div class="menu-command__items">
      <slot></slot>
    </div>

    <div class="${state.isOpen ? 'block' : 'hidden'}">
      <button class="z-30 block fixed inset-0 w-full h-full cursor-default" 
        click.delegate="state.isOpen = false" type="button"></button>
      <div class="absolute z-40 right-0">
        <template replaceable part="content"></template>
      </div>
    </div>
  </div>
  
  <!--
  <div class="menu-command">
    <div class="menu-command__icon">
      <i class="fas fa-ellipsis-v""></i>
    </div>
    <div class="hidden menu-command__items">
      <slot></slot>
    </div>
  </div>

  <dropdown class="account-bar__dropdown" view-model.ref="dropdownRef">
    <target>
      <i class="fas fa-ellipsis-v""></i>
    </target>
    <content>
      <div class="account-bar__dropdown-content">
        <slot></slot>
      </div>
    </content>
  </dropdown>
  -->
</template>
`)
export class MenuCommand implements ICommand {
  public state = {
    isOpen: false
  };

  @bindable()
  public exec: () => void;

  public alertMe(): void {
    alert('my');
  }

  public notify(): void {
    if (this.exec) {
      this.exec();
    }
  }
}
*/
