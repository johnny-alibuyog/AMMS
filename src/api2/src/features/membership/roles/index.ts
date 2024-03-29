import { Request, Response } from 'express';
import { RoleContract, RoleIdContract, RolePageRequest, roleService } from './role.services';
import { Route, resourceBuilder } from '../../../utils';

import { Action } from './role.models';
import { authorize } from '../../../middlewares/auth';
import { handle } from '../../../utils/response.handlers';
import { resources } from '../resources/data/resource.data';
import { wrap } from '../../../utils/error.handlers';

const basePath = () => resourceBuilder('roles');

const guard = (action: Action) =>
  authorize({ resource: resources.membership.role, action: action });

const routes: Route[] = [
  {
    path: basePath().resource('lookup').build(),
    method: 'get',
    handlers: [
      guard(Action.read),
      wrap(async (req: Request, res: Response) => {
        const result = await roleService.lookup();
        handle(req, res, result);
      })
    ]
  },
  {
    path: basePath().build(),
    method: 'get',
    handlers: [
      guard(Action.read),
      wrap(async (req: Request, res: Response) => {
        const params = req.query as unknown as RolePageRequest;
        const result = await roleService.find(params);
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
        const id = req.params['id'] as RoleIdContract;
        const result = await roleService.get(id);
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
        const role = req.body as RoleContract;
        const id = await roleService.create(role);
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
        const id = req.params['id'] as RoleIdContract;
        const role = req.body as RoleContract;
        await roleService.update(id, role);
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
        const id = req.params['id'] as RoleIdContract;
        const role = req.body as Partial<RoleContract>;
        await roleService.patch(id, role);
        handle(req, res, true);
      })
    ]
  }, {
    path: basePath().param('id').build(),
    method: 'delete',
    handlers: [
      guard(Action.delete),
      wrap(async (req: Request, res: Response) => {
        const id = req.params['id'] as RoleIdContract;
        await roleService.remove(id);
        handle(req, res, true);
      })
    ]
  }
];

export default routes;

export { basePath }