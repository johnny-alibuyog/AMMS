import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { Subscription } from 'rxjs';
import { BindingEngine, Disposable, computedFrom } from 'aurelia-binding';
import { state } from 'kernel/state';
import { appConfig } from 'app-config';
import { FormPageState } from 'kernel/state/models';

@autoinject()
export class Spinner {
  public debounceValue: number = appConfig.spinnerDebounce;

  @computedFrom('_isRequesting')
  public get isRequesting(): boolean {
    return this._isRequesting;
  } 

  @computedFrom('_isRouterNavigating', '_isDiscardPromptVisible')
  public get isNavigating(): boolean {
    return this._isRouterNavigating && !this._isDiscardPromptVisible;
  }   

  private _isRequesting: boolean = false;

  private _isDiscardPromptVisible: boolean = false;
  private _isDiscardPromptVisibleSubscription: Disposable = null;

  private _isRouterNavigating: boolean = false;
  private _isRouterNavigatingSubscription: Subscription = null;

  constructor(
    private readonly _router: Router,
    private readonly _engine: BindingEngine
  ) { }

  private setRequestingEnd = (ev: Event) => this._isRequesting = false;

  private setRequestingStart = (ev: Event) => this._isRequesting = true;

  private setIsRouterNavigating = (newValue: any, oldValue: any) => this._isRouterNavigating = newValue;

  private setIsDiscardPromptVisible = (value: FormPageState) => this._isDiscardPromptVisible = value.isDiscardPromptVisible;

  public attached(): void {
    this._isRouterNavigatingSubscription = state.formPage.state()
      .subscribe(this.setIsDiscardPromptVisible);
    this._isDiscardPromptVisibleSubscription = this._engine
      .propertyObserver(this._router, 'isNavigating')
      .subscribe(this.setIsRouterNavigating);
    document.addEventListener('aurelia-fetch-client-request-started', this.setRequestingStart);
    document.addEventListener('aurelia-fetch-client-requests-drained', this.setRequestingEnd);
  }
 
  public detached(): void {
    this._isRouterNavigatingSubscription.unsubscribe();
    this._isDiscardPromptVisibleSubscription.dispose();
    document.removeEventListener('aurelia-fetch-client-request-started', this.setRequestingStart);
    document.removeEventListener('aurelia-fetch-client-requests-drained', this.setRequestingEnd);
  }
}
