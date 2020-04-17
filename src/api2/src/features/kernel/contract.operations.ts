import { PageRequest, PageResponse } from './contract.models';

export type Find<T> = (request: PageRequest) => Promise<PageResponse<T>>;
