type Lookup = {
  id: string,
  name: string
}

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

export {
  Lookup,
  PageRequest,
  PageResponse
}
