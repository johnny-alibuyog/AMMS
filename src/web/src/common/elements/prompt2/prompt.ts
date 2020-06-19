import { autoinject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

export type PromptOptions = {
  title: string,
  message: string,
  promptType: PromptType,
  buttons: {
    confirm?: {
      label: string,
      action: () => boolean
    },
    cancel?: {
      label: string,
      action: () => boolean
    }
  }
}

export type PromptType2 = 'info' | 'question' | 'error' | 'warning';

export enum PromptType {
  OkCancel,
  YesNo,
  YesNoCancel,
}

export enum PromptResult {
  Ok,
  Cancel,
  Yes,
  No
}

@autoinject()
export class Prompt {

  private readonly _controller: DialogController

  public options: PromptOptions;

  constructor(controller: DialogController) {
    this._controller = controller;
  }

  public activate(options: PromptOptions): void {
    this.options = options;
  }

  public ok(): void {
    this._controller.ok();
  }

  public cancel(): void {
    this._controller.cancel();
  }
}
