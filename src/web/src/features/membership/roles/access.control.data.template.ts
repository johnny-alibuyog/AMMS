import { AccessControl, Action, Resource, Role } from "./role.models"

import { Ownership } from "features/common/ownership/ownership.model";
import { resources } from "../resources/resource.data"

const accessControlTemplates: AccessControl[] = [
  // {
  //   resource: resources.all.id,
  //   permissions: [
  //     { action: Action.read, ownership: Ownership.none },
  //     { action: Action.create, ownership: Ownership.none },
  //     { action: Action.update, ownership: Ownership.none },
  //     { action: Action.delete, ownership: Ownership.none },
  //   ]
  // },
  {
    resource: resources.common.image.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.membership.tenant.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.membership.tenantUserSettings.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.membership.branch.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.membership.role.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.membership.user.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.membership.userPassword.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.sales.salesOrder.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.sales.salesInvoice.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.sales.payments.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.sales.collectibles.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.purchasing.purchaseOrder.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.purchasing.voucher.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.purchasing.returns.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.purchasing.vendors.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },
  {
    resource: resources.purchasing.payables.id,
    permissions: [
      { action: Action.read, ownership: Ownership.none },
      { action: Action.create, ownership: Ownership.none },
      { action: Action.update, ownership: Ownership.none },
      { action: Action.delete, ownership: Ownership.none },
    ]
  },

];

const getAccessControlTemplate = (resource: Resource): AccessControl =>
  accessControlTemplates.find(x => x.resource === resource.id);

const isDefaultAccessControl = (accessControl: AccessControl): boolean => {
  const defaultValue = accessControlTemplates.find(x => x.resource === accessControl.resource);
  if (!defaultValue) {
    return false;
  }
  if (defaultValue?.permissions?.length !== accessControl?.permissions?.length) {
    return false;
  }
  for (const { action, ownership } of defaultValue.permissions) {
    const isSamePermission = accessControl.permissions.some(x => x.action === action && x.ownership === ownership);
    if (!isSamePermission) {
      return false;
    }
  }
  return true;
  // const isDefault = defaultValue.permissions.reduce((acc, current) => {
  //   const permission = accessControl.permissions.find(x => x.action == current.action);
  //   return acc && permission?.ownership === current?.ownership; 
  // }, true);
  // return isDefault;
};

const isNotDefaultAccessControl = (accessControl: AccessControl): boolean =>
  !isDefaultAccessControl(accessControl);

const sanitizeRole = (role: Role) => {
  const defaultAccessControls = role.accessControls.filter(isDefaultAccessControl);
  if (defaultAccessControls.length > 0) {
    defaultAccessControls.forEach(x => {
      const index = role.accessControls.indexOf(x);
      role.accessControls.splice(index, 1);
    });
  }
  return role;
}

export {
  sanitizeRole,
  accessControlTemplates,
  getAccessControlTemplate
}