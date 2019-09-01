import { bindable } from "aurelia-framework";

export type Command = ActionCommand | MenuCommand;

export type ActionCommand = {
  type: "action";
  icon: IconType;
  action: () => void;
};

export type MenuCommand = {
  type: "menu";
  icon: IconType;
  commands: MenuCommandItem[];
};

export type MenuCommandItem = {
  title: string;
  action: () => void;
};

export type IconType = "add" | "grid" | "list" | "more";

export class ListLayoutCommands {
  @bindable()
  public commands: Command[] = [];

  public iconMap: { [key: string]: string } = {
    add: "fas fa-plus",
    grid: "fas fa-grip-vertical",
    list: "fas fa-list",
    more: "fas fa-ellipsis-v"
  };
}
