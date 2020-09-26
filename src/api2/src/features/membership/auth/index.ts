import { LoginRequest, authService } from "./auth.service";
import { Request, Response } from 'express';
import { Route, resourceBuilder } from "../../../utils";

import { Action } from '../roles/role.models';
import { authorize } from '../../../middlewares/auth';
import { handle } from '../../../utils/response.handlers';
import { resources } from '../resources/data/resource.data';
import { wrap } from '../../../utils/error.handlers';

const basePath = () => resourceBuilder('auth');

const guard = (action: Action) => 
authorize({ resource: resources.membership.user, action: action });

const routes: Route[] = [
  {
    path: basePath().resource('login').build(),
    method: 'post',
    handlers: [
      wrap(async (req: Request, res: Response) => {
        const credentials = req.body as LoginRequest;
        const token = await authService.login(credentials);
        handle(req, res, token, 200);
      })
    ]
  },
  {
    path: basePath().resource('logout').build(),
    method: 'post',
    handlers: [
      wrap(async (req: Request, res: Response) => {
        await authService.logout();
        handle(req, res, {}, 200);
      })
    ]
  },
  {
    path: basePath().resource('secure').build(),
    method: 'post',
    handlers: [
      guard(Action.read),
      wrap(async (req: Request, res: Response) => {
        await authService.secure();
        handle(req, res, {}, 200);
      })
    ]
  },
];

export { basePath }

export default routes;