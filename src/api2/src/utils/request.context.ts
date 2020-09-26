import * as storage from 'cls-hooked';

import { NextFunction, Request, Response } from 'express';

import { ObjectId } from 'mongodb';
import { Permission } from '../features/membership/roles/role.models';
import { config } from '../config';

type RequestContext = {
  path: string,
  time: Date,
  userId?: ObjectId,
  branchIds?: ObjectId[],
  permission?: Permission,
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
  return session?.get(SESSION_KEY) as RequestContext;
}

const setContextUser = (
  userId: RequestContext['userId'], 
  branchIds: RequestContext['branchIds'],
  permission: RequestContext['permission']): void => {

  const context = currentContext();
  if (context) {
    context.userId = userId;
    context.branchIds = branchIds,
    context.permission = permission;
  }
}

const context = {
  create: createContext,
  current: currentContext,
  setUser: setContextUser
}

export { context }