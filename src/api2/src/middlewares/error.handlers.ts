import { errorHandler } from '../utils/error.handlers';
import { Request, Response, NextFunction, Router } from 'express';
import { MiddlewareFn } from './types';

const handle404Error: MiddlewareFn = (router: Router) => {
  router.use((req: Request, res: Response) => {
    errorHandler.notFoundError();
  });
};

const handleClientError: MiddlewareFn = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.clientError(err, res, next);
  });
};

const handleServerError: MiddlewareFn = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler.serverError(err, res, next);
  });
};

export {
  handle404Error,
  handleClientError,
  handleServerError
}