import { ListPageState } from "kernel/state/models";
import { Subscription } from "rxjs";
import { bindable } from "aurelia-framework";
import { state } from "kernel/state";

export class ListLayout {

  @bindable()
  public title: string = "";

  public settings: ListPageState;

  private subscriptions: Subscription[] = [];

  public toggleFilter(): void {
    this.settings.isFilterVisible = !this.settings.isFilterVisible;
    state.listPage.set(this.settings);
  }

  public setView(view: ListPageState['view']): void {
    this.settings.view = view;
    state.listPage.set(this.settings);
  }

  public async attached(): Promise<void> {
    this.settings = await state.listPage.current();
    this.subscriptions = [
      state.listPage.state().subscribe(value => this.settings = value)
    ];
  }

  public detached(): void {
    this.subscriptions.forEach(x => x.unsubscribe());
  }
}
