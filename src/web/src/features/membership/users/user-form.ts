import { Image, ImageId, initImage } from "features/common/images/image.models";
import { User, UserId, initUser, userRules } from "./user.models";
import { ValidateResult, ValidationController, ValidationControllerFactory } from "aurelia-validation";
import { fullName, personRules } from 'features/common/person/person.model';

import { BreadcrumbItem } from "common/elements/breadcrumbs/custom-breadcrumbs";
import { CameraDialog3 } from "common/elements/camera/camera-dialog3";
import { DialogService } from "aurelia-dialog";
import { Lookup } from 'features/common/model';
import { PromptService } from 'common/elements/prompt/prompt-service';
import { Router } from 'aurelia-router';
import { ToastService } from 'common/elements/toast/toast-service';
import { ValidationFormRenderer } from 'common/validations/validation-form-renderer';
import { api } from 'features/api';
import { autoinject } from 'aurelia-framework';
import { dirtyChecker } from 'common/utils';

@autoinject()
export class UserForm {
  public user: User = initUser();
  public photo: Image = initImage();
  public blankPhoto: any = require('./blank-profile-picture.jpg');
  public roles: Lookup[] = [];
  public breadcrumbItems: BreadcrumbItem[] = [];
  public readonly errors: ValidateResult[] = [];
  public readonly validator: ValidationController;

  private _isUserDirty: (user: User) => boolean;
  private _isPhotoDirty: (photo: Image) => boolean;

  constructor(
    private readonly _router: Router,
    private readonly _toast: ToastService,
    private readonly _prompt: PromptService,
    private readonly _dialog: DialogService,
    renderer: ValidationFormRenderer,
    factory: ValidationControllerFactory
  ) {
    this.validator = factory.createForCurrentScope();
    this.validator.addRenderer(renderer);
  }

  public async activate(params: any): Promise<void> {
    debugger;
    const id = params['id'];
    this.user = id ? await api.users.get(id) : initUser();
    this.photo = this.user?.photo ? await api.images.get(this.user.photo as ImageId) : initImage();
    this.roles = await api.roles.lookup();
    const title = this.user ? `${this.user.person.firstName} ${this.user.person.lastName}` : undefined;
    this.validator.addObject(this.user, userRules);
    this.validator.addObject(this.user.person, personRules);
    this._isUserDirty = dirtyChecker(this.user);
    this._isPhotoDirty = dirtyChecker(this.photo);
    this.breadcrumbItems = [
      { title: 'Users', url: this._router.generate("users/user-list") },
      { title: 'New User', url: this._router.generate("users/user-form"), ...{ title } }
    ];
  }

  public async changePhoto(): Promise<void> {
    const settings = { viewModel: CameraDialog3 };
    const result = await this._dialog.open(settings).whenClosed();
    if (result.wasCancelled) {
      return;
    }
    this.photo.data = result.output;

    // const context = this.canvas.getContext('2d').drawImage(this.video, 0, 0, 640, 480);
    // const capture = this.canvas.toDataURL('image/png');
    // this.captures.push(capture);
  }

  public async canDeactivate(): Promise<boolean> {
    if (this._isUserDirty(this.user) || this._isPhotoDirty(this.photo)) {
      return await this._prompt.discard();
    }
    return true;
  }

  public async save(): Promise<void> {
    const valResult = await this.validator.validate();
    if (!valResult.valid) {
      return;
    }
    const promptResult = await this._prompt.save('Save User', 'Do you want to save changes?');
    if (!promptResult) {
      return;
    }
    const photoId = await this.savePhoto(this.photo);
    const userId = await this.saveUser(this.user, photoId);
    await this._toast.success(`User ${fullName(this.user.person)} has been saved.`, 'Successful');
    await this.reload(userId);
  }

  private async savePhoto(photo: Image): Promise<ImageId> {
    if (!this._isPhotoDirty(photo)) {
      return photo.id;
    }
    if (photo.id) {
      await api.images.update(photo.id, photo);
    }
    else {
      photo.id = await api.images.create(photo);
    }
    return photo.id;
  }

  private async saveUser(user: User, photoId: ImageId): Promise<UserId> {
    user.photo = photoId;
    if (!this._isUserDirty(user)) {
      return user.id;
    }
    if (user.id) {
      await api.users.update(user.id, user);
    }
    else {
      user.id = await api.users.create(user);
    }
    return user.id;
  }

  public async reload(userId: UserId) {
    await this.activate({ id: userId });
    // this._router.navigateToRoute("users/user-form", userId);
  }

  public cancel(): void {
    // this._router.navigateBack();
    this._router.navigateToRoute("users/user-list");
  }
}
