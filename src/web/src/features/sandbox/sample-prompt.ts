import { autoinject } from 'aurelia-framework';
import { PromptService } from 'common/elements/prompt/prompt-service';

@autoinject()
export class SamplePrompt {
  public title: string = 'Sample Prompt';

  constructor(private readonly _prompt: PromptService) { }

  public inform(): void {
    this._prompt.inform('Infomation Title', 'Here goes information message.');
  }

  public confirm(): void {
    this._prompt.save('Save User', 'Do you want to save changes?');
    // this._prompt.save('Confirmation Title', 'Here goes confirmation message?');
  }

  public alert(): void {
    this._prompt.discard();
  }
}
