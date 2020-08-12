import { Action } from '../roles/role.models';
import { Request, Response } from 'express';
import { Route, resourceBuilder } from './../../../utils/index';
import { UserContract, UserIdContract, UserPageRequest, userService } from './user.services';

import { authorize } from '../../../middlewares/auth';
import { handle } from '../../../utils/response.handlers';
import { logger } from '../../../utils/logger';
import { resources } from '../resources/data/resource.data';
import { wrap } from '../../../utils/error.handlers';

const basePath = () => resourceBuilder('users')

const guard = (action: Action) =>
  authorize({ resource: resources.membership.user, action: action });

const routes: Route[] = [
  {
    path: basePath().build(),
    method: 'get',
    handlers: [
      guard(Action.read),
      wrap(async (req: Request, res: Response) => {
        const params = <unknown>req.query as UserPageRequest;
        const result = await userService.find(params);
        handle(req, res, result);
      })
    ]
  },
  {
    path: basePath().param('id').build(),
    method: 'get',
    handlers: [
      guard(Action.read),
      wrap(async (req: Request, res: Response) => {
        const id = req.params['id'] as UserIdContract;
        const result = await userService.get(id);
        handle(req, res, result);
      })
    ]
  },
  {
    path: basePath().build(),
    method: 'post',
    handlers: [
      guard(Action.create),
      wrap(async (req: Request, res: Response) => {
        const user = req.body as UserContract;
        const id = await userService.create(user);
        handle(req, res, id);
      })
    ]
  },
  {
    path: basePath().param('id').build(),
    method: 'put',
    handlers: [
      guard(Action.update),
      wrap(async (req: Request, res: Response) => {
        const id = req.params['id'] as UserIdContract;
        const user = req.body as UserContract;
        await userService.update(id, user);
        handle(req, res, true);
      })
    ]
  },
  {
    path: basePath().param('id').build(),
    method: 'patch',
    handlers: [
      guard(Action.update),
      wrap(async (req: Request, res: Response) => {
        const id = req.params['id'] as UserIdContract;
        const user = req.body as Partial<UserContract>;
        await userService.patch(id, user);
        handle(req, res, true);
      })
    ]
  },
  {
    path: basePath().param('id').build(),
    method: 'delete',
    handlers: [
      guard(Action.delete),
      wrap(async (req: Request, res: Response) => {
        const id = req.params['id'] as UserIdContract;
        await userService.remove(id);
        handle(req, res, true);
      })
    ]
  },
];

export { basePath }

export default routes;