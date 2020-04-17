import { Request, Response } from 'express';
import { HTTP404Error, HTTP400Error } from './http.errors';
import { HttpVerb } from '.';

const handle = <TModel>(req: Request, res: Response, data?: TModel, status?: number) => {
  const success = (data) ? true : false;
  const method = req.method.toLowerCase() as HttpVerb;
  if (success) {
    const successStatus = {
      'get': 200,
      'post': 201,
      'put': 204,
      'patch': 204,
      'delete': 204
    };
    const statusCode = status ?? successStatus[method];
    res.status(statusCode).json(data);
  }
  else {
    const errors = {
      'get': new HTTP404Error(),
      'post': new HTTP400Error(),
      'put': new HTTP400Error(),
      'patch': new HTTP400Error(),
      'delete': new HTTP400Error()
    };
    const error = errors[method];
    res.status(error.statusCode).send(error.message);
  }
}

export { handle }