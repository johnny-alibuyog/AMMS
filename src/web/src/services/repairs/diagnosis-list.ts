import {
  ActionCommand,
  MenuCommand,
  MenuCommandItem
} from "./../../shell/layouts/list-layout-commands";
import { Command } from "../../shell/layouts/list-layout-commands";

export class DiagnosisList {
  public title: string = "Diagnoses";

  public add(): void {
    alert("add");
  }

  // public commands: Command[] = [
  //   <ActionCommand>{
  //     icon: 'add',
  //     action: () => alert('add')
  //   },
  //   <MenuCommand>{
  //     icon: 'more',
  //     commands: [
  //       <MenuCommandItem>{
  //         title: 'Hello',
  //         action: () => alert('Hello')
  //       }
  //     ]
  //   }
  // ];
}
