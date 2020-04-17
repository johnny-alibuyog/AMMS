import { MiddlewareFn } from './types';
import { handleAPIDocs } from './api.docs';
import {
  handleRequestLogging,
  handleSecurity,
  handleCors,
  handleRequestContext,
  handleBodyRequestParsing,
  handleCompression
} from './common';
import {
  handle404Error,
  handleClientError,
  handleServerError
} from './error.handlers'

export const commonMiddlewares: MiddlewareFn[] = [
  handleRequestLogging,
  handleSecurity,
  handleCors,
  handleRequestContext,
  handleBodyRequestParsing,
  handleCompression,
  handleAPIDocs
];

export const errorHandlers: MiddlewareFn[] = [
  handle404Error,
  handleClientError,
  handleServerError
];