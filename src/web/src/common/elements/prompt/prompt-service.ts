import { autoinject } from 'aurelia-framework';
import { PromptType, PromptResult, Prompt, PromptOptions } from './prompt';
import { DialogService, DialogSettings } from 'aurelia-dialog';

@autoinject()
export class PromptService {

  constructor(private readonly _dialogService: DialogService) { }

  public async show(title: string, message: string, promptType: PromptType = PromptType.OkCancel) : Promise<PromptResult> {
    const settings: DialogSettings = {
      viewModel: Prompt,
      model: <PromptOptions>{
        title: title,
        message: message,
        promptType: promptType
      }
    }
    
    const response = await this._dialogService.open(settings).whenClosed();

    if (!response.wasCancelled) {
      return PromptResult.Ok;
    }    
    else {
      return PromptResult.Cancel;
    }
  }
}
