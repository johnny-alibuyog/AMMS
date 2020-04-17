import cors from 'cors';
import morgan from 'morgan';
import parser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import { Router } from 'express';
import { MiddlewareFn } from './types';
import { morganOption } from './../utils/logger';
import { context } from '../utils/request.context';

// https://blog.jscrambler.com/setting-up-5-useful-middlewares-for-an-express-api/
const handleRequestLogging: MiddlewareFn = (router: Router) => {
  router.use(morgan('combined', morganOption));
}

const handleSecurity: MiddlewareFn = (router: Router) => {
  router.use(helmet());
};

const handleCors: MiddlewareFn = (router: Router) => {
  router.use(cors({ credentials: true, origin: true }));
}

const handleRequestContext: MiddlewareFn = (router: Router) => {
  router.use(context.create());
}

const handleBodyRequestParsing: MiddlewareFn = (router: Router) => {
  router.use(parser.urlencoded({ extended: true }));
  router.use(parser.json());
};

const handleCompression: MiddlewareFn = (router: Router) => {
  router.use(compression());
};

export {
  handleRequestLogging,
  handleSecurity,
  handleCors,
  handleRequestContext,
  handleBodyRequestParsing,
  handleCompression
}