import { ImageContract, ImageIdContract, imageService } from './image.service';
import { Request, Response } from 'express';
import { Route, resourceBuilder } from './../../../utils/index';

import { Action } from '../../membership/roles/role.models';
import { authorize } from '../../../middlewares/auth';
import { handle } from '../../../utils/response.handlers';
import { resources } from '../../membership/resources/data/resource.data';
import { wrap } from '../../../utils/error.handlers';

const basePath = () => resourceBuilder('images')

const guard = (action: Action) =>
  authorize({ resource: resources.common.image, action: action });

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