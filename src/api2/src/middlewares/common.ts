import { MiddlewareFn } from './types';
import { Router } from 'express';
import compression from 'compression';
import { context } from '../utils/request.context';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { morganOption } from './../utils/logger';
import parser from 'body-parser';

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
  router.use(parser.json({ limit: '50mb' }));
  router.use(parser.urlencoded({ limit: '50mb', extended: true }));
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