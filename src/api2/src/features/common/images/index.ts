import { Request, Response, NextFunction } from 'express';
import { Route, resourceBuilder } from './../../../utils/index';
import { authorize } from '../../../middlewares/auth';
import { handle } from '../../../utils/response.handlers';
import { wrap } from '../../../utils/error.handlers';
import { Action, Resource } from '../../membership/roles/role.models';
import { imageService, ImageIdContract, ImageContract } from './image.service';

const basePath = () => resourceBuilder('images')

const guard = (action: Action) =>
  authorize({ resource: Resource.common_image, action: action });

const routes: Route[] = [
  {
    path: basePath().param('id').build(),
    method: 'get',
    handlers: [
      guard(Action.read),
      wrap(async (req: Request, res: Response) => {
        const id = req.params['id'] as ImageIdContract;
        const result = await imageService.get(id);
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
        const image = req.body as ImageContract;
        const id = await imageService.create(image);
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
        const id = req.params['id'] as ImageIdContract;
        const image = req.body as ImageContract;
        await imageService.update(id, image);
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
        const id = req.params['id'] as ImageIdContract;
        await imageService.remove(id);
        handle(req, res, true);
      })
    ]
  },
];

export { basePath }

export default routes;