export class UserSettings {
  public title: string = "User Settings";
  public xs: number[] = [];

  public activate(): void {
    for (let index = 0; index < 500; index++) {
      this.xs.push(index);
    }
  }
}
