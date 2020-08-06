import { Branch, BranchId, initBranch, isBranchNew } from "./branch.models";
import { ValidateResult, ValidationController, ValidationControllerFactory } from "aurelia-validation";

import { BreadcrumbItem } from "common/elements/breadcrumbs/custom-breadcrumbs";
import { DialogService } from "aurelia-dialog";
import { PromptService } from 'common/elements/prompt/prompt-service';
import { Router } from 'aurelia-router';
import { ToastService } from 'common/elements/toast/toast-service';
import { ValidationFormRenderer } from 'common/validations/validation-form-renderer';
import { api } from 'features/api';
import { autoinject } from 'aurelia-framework';
import { branchRules } from "./branch.validation";
import { dirtyChecker } from 'common/utils';

@autoinject()
export class BranchForm {
  public branch: Branch = initBranch();
  public breadcrumbItems: BreadcrumbItem[] = [];
  public readonly errors: ValidateResult[] = [];
  public readonly validator: ValidationController;

  private _isDirty: (branch: Branch) => boolean;

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
    const id = params['id'];
    this.branch = id ? await api.branches.get(id) : initBranch();
    const title = isBranchNew(this.branch) ? 'New Branch' : `${this.branch.name}`;
    this.validator.addObject(this.branch, branchRules);
    this._isDirty = dirtyChecker(this.branch);
    this.breadcrumbItems = [
      { title: 'Branches', url: this._router.generate("branches/branch-list") },
      { title: 'New Branch', url: this._router.generate("branches/branch-form"), ...{ title } }
    ];
  }

  public async canDeactivate(): Promise<boolean> {
    if (this._isDirty(this.branch)) {
      return await this._prompt.discard();
    }
    return true;
  }

  public async save(): Promise<void> {
    const valResult = await this.validator.validate();
    if (!valResult.valid) {
      return;
    }
    const promptResult = await this._prompt.save('Save Branch', 'Do you want to save changes?');
    if (!promptResult) {
      return;
    }
    const branchId = await this.saveBranch(this.branch);
    await this._toast.success(`Branch ${this.branch.name} has been saved.`, 'Successful');
    await this.reload(branchId);
  }

  private async saveBranch(branch: Branch): Promise<BranchId> {
    if (!this._isDirty(branch)) {
      return branch.id;
    }
    if (isBranchNew(branch)) {
      branch.id = await api.branches.create(branch);
    }
    else {
      await api.branches.update(branch.id, branch);
    }
    return branch.id;
  }

  public async reload(branchId: BranchId) {
    await this.activate({ id: branchId });
    // this._router.navigateToRoute("branches/branch-form", branchId);
  }

  public cancel(): void {
    // this._router.navigateBack();
    this._router.navigateToRoute("branches/branch-list");
  }
}
