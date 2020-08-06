import { Action, Resource } from '../roles/role.models';
import { BranchContract, BranchIdContract, BranchPageRequest, branchService } from './branch.services';
import { Request, Response } from 'express';
import { Route, resourceBuilder } from './../../../utils/index';

import { authorize } from '../../../middlewares/auth';
import { handle } from '../../../utils/response.handlers';
import { wrap } from '../../../utils/error.handlers';

const basePath = () => resourceBuilder('branches');

const guard = (action: Action) =>
  authorize({ resource: Resource.membership_branch, action: action });

const routes: Route[] = [
  {
    path: basePath().resource('lookup').build(), /* should be defined before the get/:id since these two conflicts */
    method: 'get',
    handlers: [
      guard(Action.read),
      wrap(async (req: Request, res: Response) => {
        const result = await branchService.lookup();
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
        const params = req.query as BranchPageRequest;
        const result = await branchService.find(params);
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
        const id = req.params['id'] as BranchIdContract;
        const result = await branchService.get(id);
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
        const branch = req.body as BranchContract;
        const id = await branchService.create(branch);
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
        const id = req.params['id'] as BranchIdContract;
        const branch = req.body as BranchContract;
        await branchService.update(id, branch);
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
        const id = req.params['id'] as BranchIdContract;
        const branch = req.body as Partial<BranchContract>;
        await branchService.patch(id, branch);
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
        const id = req.params['id'] as BranchIdContract;
        await branchService.remove(id);
        handle(req, res, true);
      })
    ]
  },
];

export { basePath }

export default routes;