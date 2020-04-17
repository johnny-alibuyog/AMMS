import { wrap } from '../../../utils/error.handlers';
import { handle } from '../../../utils/response.handlers';
import { authorize } from '../../../middlewares/auth';
import { Resource, Action } from './role.models';
import { Request, Response } from 'express';
import { Route, resourceBuilder } from '../../../utils';
import { roleService, RolePageRequest, RoleIdContract, RoleContract } from './role.services';

const basePath = () => resourceBuilder('roles');

const guard = (action: Action) =>
  authorize({ resource: Resource.membership_role, action: action });

const routes: Route[] = [
  {
    path: basePath().build(),
    method: 'get',
    handlers: [
      guard(Action.read),
      wrap(async (req: Request, res: Response) => {
        const params = req.query as RolePageRequest;
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