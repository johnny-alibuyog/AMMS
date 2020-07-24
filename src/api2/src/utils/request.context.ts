import * as storage from 'cls-hooked';
import { config } from '../config';
import { Request, Response, NextFunction } from 'express';
import { Permission } from '../features/membership/roles/role.models';

type PermissionGuard = Permission;

type RequestContext = {
  path: string,
  time: Date,
  userId?: string,
  permission?: PermissionGuard,
}

const SESSION_KEY = 'REQUEST_CONTEXT';

const createContext = () => (req: Request, res: Response, next: NextFunction): void => {
  const session = storage.createNamespace(config.tenant.name);

  // wrap the events from request and response
  session.bindEmitter(req);
  session.bindEmitter(res);

  // run following middleware in the scope of the namespace we created
  session.run(() => {
    const context: RequestContext = {
      path: req.path,
      time: new Date()
    };

    // set data on the namespace, makes it available for all continuations
    session.set(SESSION_KEY, context);
    next();
  });
}

const currentContext = (): RequestContext | undefined => {
  const session = storage.getNamespace(config.tenant.name);
  return session.get(SESSION_KEY) as RequestContext;
}

const setContextUser = (userId: RequestContext['userId'], permission: RequestContext['permission']): void => {
  const context = currentContext();
  if (context) {
    context.userId = userId;
    context.permission = permission;
  }
}

export const context = {
  create: createContext,
  current: currentContext,
  setUser: setContextUser
}

export {
  RequestContext,
  PermissionGuard,
}