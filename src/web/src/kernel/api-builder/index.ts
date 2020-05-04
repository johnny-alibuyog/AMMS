import { client } from "./http-client-facade"
import { buildQueryString } from 'aurelia-path';

const apiBuilder = <TId, TEntity, TParam>(resource: string) => {
  const get = (id: TId): Promise<TEntity> =>
    client.get(`${resource}/${id}`);

  const find = (param: TParam): Promise<TEntity[]> =>
    client.get(`${resource}?${buildQueryString(param)}`);

  const create = (entity: TEntity): Promise<TId> =>
    client.post(`${resource}`, entity);

  const update = (id: TId, entity: TEntity): Promise<void> =>
    client.put(`${resource}/${id}`, entity);

  const patch = (id: TId, entity: Partial<TEntity>): Promise<void> =>
    client.patch(`${resource}/${id}`, entity);

  const remove = (id: TId): Promise<void> =>
    client.delete(`${resource}/${id}`);

    return {
      get: get,
      find: find,
      create: create,
      update: update,
      patch: patch,
      delete: remove
    }
}

export default apiBuilder;
