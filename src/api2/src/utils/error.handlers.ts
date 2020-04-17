import { logger } from './logger';
import { Request, Response, NextFunction } from 'express';
import { HTTPClientError, HTTP404Error } from '../utils/http.errors';

const notFoundError = () => {
  throw new HTTP404Error('Resource not found.');
};

const clientError = (err: Error, res: Response, next: NextFunction) => {
  if (err instanceof HTTPClientError) {
    logger.error(err);
    res.status(err.statusCode).send(err.message);
  } 
  else {
    next(err);
  }
};

const serverError = (err: Error, res: Response, next: NextFunction) => {
  logger.error(err);
  if (process.env.NODE_ENV === 'production') {
    res.status(500).send('Internal Server Error');
  } 
  else {
    res.status(500).send(err.stack);
  }
};

// this will catch all errors that an server method will throw and redirect to error middlewares 
const wrap = (fn: (req: Request, res: Response, next?: NextFunction) => Promise<void>) => 
  (req: Request, res: Response, next?: NextFunction) => fn(req, res, next).catch(next);

const errorHandler = {
  notFoundError,
  clientError,
  serverError
}

export {
  wrap,
  errorHandler
}
