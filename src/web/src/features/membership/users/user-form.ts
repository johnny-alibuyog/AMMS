import { Lookup } from 'features/common/model';
import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { User, userRules, initUser, UserId } from "./user.models";
import { personRules } from 'features/common/person/person.address';
import { BreadcrumbItem } from "common/elements/custom-breadcrumbs";
import { ValidateResult, ValidationController, ValidationControllerFactory } from "aurelia-validation";
import { ToastService } from 'common/elements/toast/toast-service';
import { PromptService } from 'common/elements/prompt/prompt-service';
import { ValidationFormRenderer } from 'common/validations/validation-form-renderer';
import { PromptResult, PromptType } from 'common/elements/prompt/prompt';
import { api } from 'features/api';
import { dirtyChecker } from 'common/utils';

@autoinject()
export class UserForm {
  public user: User = initUser();
  public roles: Lookup[] = [];
  public breadcrumbItems: BreadcrumbItem[] = [];
  public readonly errors: ValidateResult[] = [];
  public readonly validator: ValidationController;
  public video: HTMLVideoElement;
  public canvas: HTMLCanvasElement;
  public captures: string[] = [];

  private _isDirty: (user: User) => boolean;

  constructor(
    private readonly _router: Router,
    private readonly _toast: ToastService,
    private readonly _prompt: PromptService,
    renderer: ValidationFormRenderer,
    factory: ValidationControllerFactory
  ) {
    this.validator = factory.createForCurrentScope();
    this.validator.addRenderer(renderer);
  }

  public async activate(params: any): Promise<void> {
    debugger;
    const id = params['id'];
    const user = id ? await api.users.get(id) : undefined;
    const title = user ? `${user.person.firstName} ${user.person.lastName}` : undefined;

    this.user = user ?? initUser();
    this.roles = await api.roles.lookup();
    this.validator.addObject(this.user, userRules);
    this.validator.addObject(this.user.person, personRules);
    this._isDirty = dirtyChecker(user);

    this.breadcrumbItems = [
      { title: 'Users', url: this._router.generate("users/user-list") },
      { title: 'New User', url: this._router.generate("users/user-form"), ...{ title } }
    ];

    /*
    if (navigator?.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = (_) => this.video.play();
      });
    }

    // if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //   navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    //     this.video.srcObject = stream;
    //     this.video.onloadedmetadata = (e) => this.video.play();
    //     // this.video.src = window.URL.createObjectURL(stream);
    //     // this.video.nativeElement.play();
    //   });
    // }
    */
  }

  public capture(): void {
    const context = this.canvas.getContext('2d').drawImage(this.video, 0, 0, 640, 480);
    const capture = this.canvas.toDataURL('image/png');
    this.captures.push(capture);
  }

  public async canDeactivate(): Promise<boolean> {
    if (this._isDirty(this.user)) {
      return this._prompt.discard();
    }

    return true;
  }

  public async deactivate(): Promise<void> {
    // const stream = this.video.srcObject as MediaStream;
    // stream.getTracks().forEach(track => track.stop());
  }

  public async save(): Promise<void> {
    const valResult = await this.validator.validate();
    if (!valResult.valid) {
      return;
    }

    const promptResult = await this._prompt.show('Do you want to save changes?', 'Save', PromptType.OkCancel);
    if (promptResult == PromptResult.Cancel) {
      return;
    }

    const create = async (user: User): Promise<void> => {
      const id = await api.users.create(user);
      this._router.navigateToRoute("users/user-form", id);
      await this._toast.info(`User ${user.username} has been created.`, 'Successful');
    };

    const update = async (id: UserId, user: User): Promise<void> => {
      await api.users.update(id, user);
      await this._toast.info(`User ${user.username} has been updated.`, 'Successful');
    };

    await ((this.user.id)
      ? update(this.user.id, this.user)
      : create(this.user)
    );
  }

  public cancel(): void {
    this._router.navigateBack();
  }
}