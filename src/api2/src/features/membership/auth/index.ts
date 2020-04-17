import { Request, Response } from 'express';
import { resourceBuilder, Route } from "../../../utils";
import { authService, LoginRequest } from "./auth.service";
import { Resource, Action } from '../roles/role.models';
import { authorize } from '../../../middlewares/auth';
import { wrap } from '../../../utils/error.handlers';
import { handle } from '../../../utils/response.handlers';

const basePath = () => resourceBuilder('auth');

const guard = (action: Action) => authorize({ resource: Resource.membership_user, action: action });

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