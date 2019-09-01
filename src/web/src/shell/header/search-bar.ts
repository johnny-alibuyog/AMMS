import * as KeyCode from "keycode-js";

export class SearchBar {
  public keyword: string = "";

  public handleKeyInput = (event: KeyboardEvent) => {
    if (event.keyCode === KeyCode.KEY_RETURN) {
      alert(this.keyword);
    }

    return true;
  };
}
