import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { KEY_ESCAPE, KEY_ENTER, KEY_LEFT, KEY_RIGHT } from 'keycode-js';

export type PromptOptions = {
  title: string,
  message: string,
  type: PromptType,
  actions: Action[]
}

export type Action = {
  label: string,
  focused: boolean,
  type: ActionType
}

export type ActionType
  = 'primary'
  | 'secondary'

export type PromptType
  = 'alert'
  | 'inform'
  | 'confirm';

export const defaultActions: Action[] = [
  {
    label: 'Ok',
    focused: true,
    type: 'primary'
  },
  {
    label: 'Cancel',
    focused: false,
    type: 'secondary'
  }
];

@autoinject()
export class Prompt {

  public options: PromptOptions;

  constructor(private readonly _controller: DialogController) { }

  public activate(options: PromptOptions): void {
    this.options = options;
    // document.addEventListener('keydown', this.handleKeyInput, false);
  }

  public deactivate(): void {
    // document.removeEventListener('keydown', this.handleKeyInput);
  }

  public handleKeyInput = (event: KeyboardEvent) => {
    const handleSubmitAction = (type: ActionType) => {
      const action = this.options.actions.find(x => x.type == type);
      this.submit(action);
    };
    const focusOnNextAction = () => {
      const action = this.options.actions.find(x => x.focused);
      const index = this.options.actions.indexOf(action);
      const isLast = this.options.actions.length === index + 1;
      if (isLast) {
        return;
      }
    }
    const focusOnPrevAction = () => {
      const action = this.options.actions.find(x => x.focused);

    }
    switch (event.keyCode) {
      case KEY_ENTER:
        handleSubmitAction('primary');
        break;
      case KEY_ESCAPE:
        handleSubmitAction('secondary');
        break;
      case KEY_LEFT:
        focusOnNextAction();
        break;
      case KEY_RIGHT:
        focusOnNextAction();
        break;
    }
    return true;
  }

  public submit(action: Action) : void {
    this._controller.ok(action?.label);
  }

  public shouldFocus(action: Action) {
    return action.type === 'primary';
  }
}
