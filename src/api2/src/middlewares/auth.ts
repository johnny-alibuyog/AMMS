import * as jwt from 'jsonwebtoken';
import { wrap } from '../utils/error.handlers';
import { config } from '../config';
import { context } from '../utils/request.context';
import { Request, Response, NextFunction } from 'express';
import { HTTP401Error, HTTP403Error } from "../utils/http.errors";
import { Action, Role } from "../features/membership/roles/role.models"
import { initDbContext } from './../features/db.context';
import { logger } from '../utils/logger';
import { Resource } from '../features/membership/resources/resource.model';
import { resources } from '../features/membership/resources/data/resource.data';
import { Branch } from '../features/membership/branches/branch.models';
import { Ref } from '@typegoose/typegoose';
import { ObjectId } from "mongodb";
import { isNotNullOrDefault } from '../features/common/helpers/query.helpers';
import { getObjectId } from '../features/common/kernel';
 
/* resource:  
 * https://stackabuse.com/authentication-and-authorization-with-jwts-in-express-js/
 * https://medium.com/@siddharthac6/json-web-token-jwt-the-right-way-of-implementing-with-node-js-65b8915d550e
 */

type Payload = {
  tenantId: string,
  userId: string,
  [key: string]: string
}

type AuthParam = { resource: Resource, action: Action };

const { accessTokenSecret } = config;

const authorize = ({ resource, action }: AuthParam) => {
  return wrap(async (req: Request, res: Response, next?: NextFunction) => {

    logger.warn('here man!');
    // const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    // await sleep(5000);

    const parts = req.headers.authorization?.split(' ') ?? null;
    if (!parts || parts.length < 2) {
      throw new HTTP401Error();
    }
    const token = parts[1];
    if (!token) {
      throw new HTTP401Error();
    }
    const payload = jwtService.verify(token);
    if (!payload) {
      throw new HTTP401Error();
    }
    /*
     * https://docs.mongodb.com/manual/reference/operator/projection/elemMatch/
     * https://docs.mongodb.com/manual/tutorial/query-array-of-documents/
     * https://docs.mongodb.com/manual/tutorial/query-arrays/
     */
    const db = await initDbContext();
    const user = await db.users
      .findById(payload.userId)
      .populate({ /* https://mongoosejs.com/docs/populate.html */
        path: 'roles',
        match: {
          $or: [
            {
              'accessControls.resource': resource._id,
              'accessControls.permissions.action': action
            },
            {
              'accessControls.resource': resources.all._id,
              'accessControls.permissions.action': Action.all
            },
          ]
        },
      })
      .exec();
    // logger.warn(JSON.stringify(user, null, 2));
    // const logMe = <T>(value: T, message?: string) => {
    //   if (message) {
    //     logger.warn(message);
    //   }
    //   logger.warn(JSON.stringify(value, null, 2));
    //   return value;
    // }
    const permissions = user?.roles
      .flatMap(x => (<Role>x).accessControls)
      // .map(x => logMe(x, 'flatMap accessControls'))
      .filter(x =>
        x.resource == resource._id?.toHexString() ||
        x.resource == resources.all._id?.toHexString()
      )
      // .map(x => logMe(x, 'filter resource'))
      .flatMap(x => x.permissions)
      // .map(x => logMe(x, 'flatMap permission'))
      .filter(x =>
        x.action == action ||
        x.action == Action.all
      );
    // logger.warn(`Permissions: ${JSON.stringify(permissions, null, 2)}`);
    const permission =
      permissions?.find(x => x.action == Action.all) ??
      permissions?.find(x => x.action == action);
    // logger.warn(`Permission Grant: ${JSON.stringify(permission, null, 2)}`);
    if (!permission) {
      throw new HTTP403Error();
    }
    const branchIds = user?.branches?.map(getObjectId).filter(isNotNullOrDefault);
    context.setUser(user?._id, branchIds, permission);
    if (next) {
      next();
    }
  });
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {

};

const jwtService = {
  sign: (payload: Payload): string => {
    return jwt.sign(payload, accessTokenSecret);
  },

  verify: (token: string): null | Payload => {
    try {
      return jwt.verify(token, accessTokenSecret) as Payload;
    }
    catch (err) {
      return null;
    }
  },

  decode: (token: string): null | { [key: string]: any } | string => {
    return jwt.decode(token, { complete: true });
  }
};

export {
  authorize,
  authenticate,
  jwtService
}