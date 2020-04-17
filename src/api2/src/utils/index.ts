import { Router, Request, Response, NextFunction } from 'express';
import { MiddlewareFn } from '../middlewares/types';
import { ResourceBuilder } from './resource.builder';

type HandlerFn = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<void> | void;

type HttpVerb = 'get' | 'post' | 'put' | 'patch' | 'delete';

type Route = {
  path: string;
  method: HttpVerb;
  handlers: HandlerFn | HandlerFn[];
};

const applyMiddleware = (middlewares: MiddlewareFn[], router: Router) => {
  for (const middleware of middlewares) {
    middleware(router);
  }
};

const applyRoutes = (routes: Route[], router: Router) => {
  for (const route of routes) {
    const { method, path, handlers } = route;
    (router as any)[method](path, handlers);
  }
};

const resourceBuilder = (baseResource: string) =>
  new ResourceBuilder('/api/v1').resource(baseResource);

export {
  HandlerFn,
  HttpVerb,
  Route
}

export {
  resourceBuilder,
  applyMiddleware,
  applyRoutes
}