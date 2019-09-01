import { bindable } from "aurelia-framework";

export class ListLayout {
  @bindable()
  public title: string = "";

  public isFilterVisible: boolean = false;

  public toggleFilter(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }
}
