import { client } from './http-client-facade';
import { buildQueryString } from 'aurelia-path';
import { PageRequest, PageResponse, Lookup } from 'features/common/model';

const apiBuilder = <TId, TEntity, TFilter, TSort, TItem>(resource: string) => {
  const get = (id: TId): Promise<TEntity> =>
    client.get(`${resource}/${id}`);

  const find = (param: PageRequest<TFilter, TSort>): Promise<PageResponse<TItem>> =>
    client.get(`${resource}?${buildQueryString(param)}`);

  const lookup = (): Promise<Lookup[]> =>
    client.get(`${resource}/lookup`);

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
    lookup: lookup,
    create: create,
    update: update,
    patch: patch,
    delete: remove
  }
}

export default apiBuilder;
