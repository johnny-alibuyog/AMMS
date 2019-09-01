export class FilterBar {
  public isOpen: boolean;

  public toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
