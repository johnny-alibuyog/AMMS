import { autoinject } from 'aurelia-framework';
import { state } from 'kernel/state';
import { FormPageState } from 'kernel/state/models';
import { DialogService, DialogSettings } from 'aurelia-dialog';
import { Prompt, PromptType, PromptOptions, Action, defaultActions } from './prompt';

type Params = {
  title: string, 
  message: string, 
  type?: PromptType, 
  actions?: Action[]
}

@autoinject()
export class PromptService {
 
  constructor(private readonly _dialogService: DialogService) { }

  private async show({ title, message, type, actions } : Params ) : Promise<string> {
    const model: PromptOptions = {
      title: title,
      message: message,
      type: type ?? 'inform',
      actions: actions ?? defaultActions
    };
    const settings: DialogSettings = {
      viewModel: Prompt,
      model: model
    }
    const response = await this._dialogService.open(settings).whenClosed();
    return response.output;
  }

  private async setDiscardState(isDiscardPromptVisible: boolean): Promise<void> {
    const formState = await state.formPage.current();
    const newValue: FormPageState = {
      ...formState,
      isDiscardPromptVisible
    }
    state.formPage.set(newValue);
  }

  public async discard(): Promise<boolean> {
    await this.setDiscardState(true);
    const params: Params = {
      title: 'Discard',
      message: 'Your changes has not been saved. To stay on the page so that you can save your changes, click Cancel',
      type: 'alert',
      actions: [
        {
          label: 'Discard',
          focused: false,
          type: 'primary'
        },
        {
          label: 'Cancel',
          focused: true,
          type: 'secondary'
        }
      ]
    }
    const result = await this.show(params);
    await this.setDiscardState(false);
    return result === 'Discard';
  }

  public async save(title: string, message: string): Promise<boolean> {
    const params: Params = {
      title: title,
      message: message,
      type: 'confirm',
      actions: [
        {
          label: 'Save',
          focused: true,
          type: 'primary'
        },
        {
          label: 'Cancel',
          focused: false,
          type: 'secondary'
        }
      ]
    }
    const result = await this.show(params);
    return result === 'Save';
  }

  public async inform(title: string, message: string): Promise<boolean> {
    const params: Params = {
      title: title,
      message: message,
      type: 'inform',
      actions: [
        {
          label: 'Ok',
          focused: true,
          type: 'primary'
        },
      ]
    }
    const result = await this.show(params);
    return result === 'Ok';
  }
}
