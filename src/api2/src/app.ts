// https://afteracademy.com/blog/design-node-js-backend-architecture-like-a-pro

import express from "express";
import routes from "./features";
import { logger } from './utils/logger';
import { applyMiddleware, applyRoutes } from "./utils";
import { commonMiddlewares, errorHandlers } from "./middlewares";

process.on('uncaughtException', e => {
  logger.error(e);
  process.exit(1);
});

process.on('unhandledRejection', e => {
  logger.error('unhandledRejection', e);
  process.exit(1);
});

const app = express();
applyMiddleware(commonMiddlewares, app);
applyRoutes(routes, app);
applyMiddleware(errorHandlers, app);

export { app }