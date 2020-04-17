export type Request = {
  id: number;
}

export type Response = {

}

export type PageResponse<TItem> = {
  items: TItem[];
  total: number;
}

export type PageRequest = {
  page: number;
  size: number;
}

// export const skipCount = (page: number, size: number) => (page - 1) * size;

export const skipCount = (request: PageRequest) => (request.page - 1) * request.size;

// type Items = {
//   name: number;
//   neff: number;
// }

// const someting: PageRequest<PageResponse<Items>> = {
//   page: 0,
//   offset: 3
// }