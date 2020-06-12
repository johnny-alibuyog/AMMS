export class UserDashboard {
  public title: string = "User Dashboard why?";
  public now: Date = new Date();
  public checked: boolean = true;
  public toggle = () => this.checked = !this.checked;
}
