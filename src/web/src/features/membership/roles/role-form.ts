import { AccessControl, Action, Permission, Resource, Role, RoleId, initRole, isRoleNew } from "./role.models";
import { Filter, Pager, SortDirection, Sorter } from "common/services/pagination";
import { PageRequest, PageResponse } from "features/common/model";
import { ValidateResult, ValidationController, ValidationControllerFactory } from "aurelia-validation";
import { accessControlTemplates, getAccessControlTemplate, sanitizeRole } from "./access.control.data.template";
import { dirtyChecker, isNotNullOrDefault } from "common/utils";

import { BreadcrumbItem } from "common/elements/breadcrumbs/custom-breadcrumbs";
import { PromptService } from "common/elements/prompt/prompt-service";
import { ResourceGroup } from "../resources/resource.model";
import { Router } from 'aurelia-router';
import { ToastService } from "common/elements/toast/toast-service";
import { ValidationFormRenderer } from "common/validations/validation-form-renderer";
import { api } from "features/api";
import { autoinject } from 'aurelia-framework';
import { cloneDeep } from "lodash";
import { data } from "../resources/resource.data";
import { functor } from "kernel";
import { roleRules } from "./role.validation";

@autoinject()
export class RoleForm {
  public title: string = 'New Role';
  public role: Role = initRole();
  public resources: Resource[] = cloneDeep(data);
  public accessControls: AccessControl[] = cloneDeep(accessControlTemplates)
  public breadcrumbItems: BreadcrumbItem[] = [];
  public readonly errors: ValidateResult[] = [];
  public readonly validator: ValidationController;

  public filter: Filter<ResourceFilter>;
  public sorter: Sorter<ResourceSort>;
  public resourcePager: Pager<Resource>;
  public dataSource: DataSource;

  private _isDirty: (role: Role) => boolean;

  constructor(
    private readonly _router: Router,
    private readonly _toast: ToastService,
    private readonly _prompt: PromptService,
    renderer: ValidationFormRenderer,
    factory: ValidationControllerFactory
  ) {
    this.validator = factory.createForCurrentScope();
    this.validator.addRenderer(renderer);
    this.dataSource = dataSourceFn(cloneDeep(data));
    this.filter = new Filter<ResourceFilter>({
      init: () => initFilter(),
      action: async () => {
        this.resourcePager.page = 1;
        await this.paginate();
      }
    });
    this.sorter = new Sorter<ResourceSort>({
      init: () => initSort(),
      action: () => this.paginate()
    });
    this.resourcePager = new Pager<Resource>({
      action: () => this.paginate(),
      config: { pageSize: 7 }
    })
  }

  private async paginate(): Promise<void> {
    const request: PageRequest<ResourceFilter, ResourceSort> = {
      filter: this.filter.valueOf(),
      sort: this.sorter.valueOf(),
      page: this.resourcePager.page,
      size: this.resourcePager.size
    };
    const result = this.dataSource(request);
    this.resourcePager.total = result.total;
    this.resourcePager.items = result.items;
    return Promise.resolve();
  }

  public async activate(params: any): Promise<void> {
    const id = params['id'];
    this.role = id ? await api.roles.get(id) : initRole();
    const title = isRoleNew(this.role) ? 'New Role' : this.role.name;
    this.validator.addObject(this.role, roleRules);
    this._isDirty = dirtyChecker(this.role);
    this.breadcrumbItems = [
      { title: 'Roles', url: this._router.generate("roles/role-list") },
      { title: 'New Role', url: this._router.generate("roles/role-form"), ...{ title } }
    ];
    await this.paginate();
  }

  public async canDeactivate(): Promise<boolean> {
    sanitizeRole(this.role);
    if (this._isDirty(this.role)) {
      return await this._prompt.discard();
    }
    return true;
  }

  public async save(): Promise<void> {
    sanitizeRole(this.role);
    if (!this._isDirty(this.role)) {
      return;
    }
    const valResult = await this.validator.validate();
    if (!valResult.valid) {
      return;
    }
    const promptResult = await this._prompt.save('Save Role', 'Do you want to save changes?');
    if (!promptResult) {
      return;
    }
    const userId = await this.saveRole(this.role);
    await this._toast.success(`Role ${this.role.name} has been saved.`, 'Successful');
    await this.reload(userId);
  }

  public async reload(roleId: RoleId) {
    await this.activate({ id: roleId });
  }

  public cancel(): void {
    // this._router.navigateBack();
    this._router.navigateToRoute("roles/role-list");
  }

  private async saveRole(role: Role): Promise<RoleId> {
    if (!this._isDirty(role)) {
      return role.id;
    }
    if (isRoleNew(role)) {
      role.id = await api.roles.create(role);
    }
    else {
      await api.roles.update(role.id, role);
    }
    return role.id;
  }

  public selectAccessControl(resource: Resource): AccessControl {
    let accessControl = this.role.accessControls.find(x => x.resource === resource.id);
    if (accessControl == null) {
      accessControl = getAccessControlTemplate(resource);
      this.role.accessControls.push(cloneDeep(accessControl));
    }
    return accessControl;
  }

  public selectPermission(action: Action, accessControl: AccessControl): Permission {
    return accessControl.permissions.find(x => x.action === action);
  }
}

type DataSource = (request: PageRequest<ResourceFilter, ResourceSort>) => PageResponse<Resource>;

type ResourceFilter = {
  keyword: string,
  groups: ResourceGroup[]
}

type ResourceSort = {
  name: SortDirection,
  active: SortDirection,
  description: SortDirection
}

const initFilter = (): ResourceFilter => ({
  keyword: '',
  groups: []
});

const initSort = (): ResourceSort => ({
  name: 'asc',
  active: 'none',
  description: 'none'
});

const dataSourceFn = (resources: Resource[]) => {
  return (page: PageRequest<ResourceFilter, ResourceSort>) => {
    // const filterKeywordFn = (keyword: string) => (items: Resource[]) =>
    //   items.filter(x => x.name.includes(keyword));

    // const filterGroupsFn = (groups: ResourceGroup[]) => (items: Resource[]) =>
    //   items.filter(x => groups.some(y => y == x.group));

    // let query = functor(resources);

    // if (isNotNullOrDefault(page?.filter?.keyword)) {
    //   query = query.map(filterKeywordFn(page.filter.keyword))
    // }

    // if (isNotNullOrDefault(page?.filter?.groups)) {
    //   query = query.map(filterGroupsFn(page?.filter?.groups))
    // }

    // const items = query.valueOf()
    //   .slice((page.page - 1) * page.size, page.page * page.size);

    // const total = query.valueOf().length;

    let query = cloneDeep(resources);
    
    if (isNotNullOrDefault(page?.filter?.keyword)) {
      query = query.filter(x => x.name.includes(page?.filter?.keyword));
    }

    if (isNotNullOrDefault(page?.filter?.groups)) {
      query = query.filter(x => page?.filter?.groups.some(y => y == x.group));
    }

    const total = query.length;

    const items = query.slice((page.page - 1) * page.size, page.page * page.size);

    const result: PageResponse<Resource> = {
      total,
      items
    };

    return result;
  }
}