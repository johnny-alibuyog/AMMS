import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../config/swagger.json';
import { MiddlewareFn } from './types.js';

export const handleAPIDocs: MiddlewareFn = (router: Router) =>
  router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
