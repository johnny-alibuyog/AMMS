import { bindable } from "aurelia-framework";
import { ListPageState } from "kernel/state/models";
import { state } from "kernel/state";
import { Subscription } from "rxjs";

export class ListLayout {

  @bindable()
  public title: string = "";

  public isFilterVisible: boolean = false;

  public settings: ListPageState;

  private subscriptions: Subscription[] = [];

  public toggleFilter(): void {
    // this.isFilterVisible = !this.isFilterVisible;
    this.settings.isFilterVisible = !this.settings.isFilterVisible;
    state.listPage.set(this.settings);
  }

  public async attached(): Promise<void> {
    this.settings = await state.listPage.current();
    this.subscriptions = [
      state.listPage.state().subscribe(val => this.settings = val)
    ];
  }

  public detached(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }
}
