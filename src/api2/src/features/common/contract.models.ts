type PageResponse<TItem> = {
  items: TItem[];
  total: number;
}

type PageRequest<TFilter, TSort> = {
  filter: TFilter;
  sort: TSort;
  page: number;
  size: number;
}

type Lookup = {
  id: string,
  name: string
}

type SortDirection = 'asc' | 'desc' | 'none';

const parsePageFrom = <TF, TS>(request: PageRequest<TF, TS>) => ({
  skip: (request.page - 1) * request.size,
  limit: request.size * 1 // ensure this is numeric
});

const builderDef = <T>() => <K extends keyof T>() => ({
  projection: (args: K[]): K[] => args,
  sort: (args: [K, SortDirection][]): [K, SortDirection][] => args
});

export {
  Lookup,
  PageRequest,
  PageResponse,
  SortDirection,
  parsePageFrom,
  builderDef
}