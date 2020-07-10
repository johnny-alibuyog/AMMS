import { state } from 'kernel/state';
import { appConfig } from '../../app-config';
import { HttpClient, json } from 'aurelia-fetch-client';

const httpClient: HttpClient = new HttpClient()
  .configure(config => config
    .withBaseUrl(appConfig.api.baseUrl)
    .withDefaults({
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'Fetch',
      }
    })
    .withInterceptor({
      request: async (request) => {
        const auth = await state.auth.current();
        if (auth?.signedIn) {
          request.headers.append('Authorization', `Bearer ${auth.token}`);
        }
        return request; // you can return a modified Request, or you can short-circuit the request by returning a Response
      },
      response: (response) => {
        return response; // you can return a modified Response
      }
    })
  )

interface SendParameters {
  data?: any;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
}

const send = async <T>(param: SendParameters): Promise<T> => {
  const response = await httpClient.fetch('/' + param.url, {
    method: param.method || "GET",
    body: param.data ? json(param.data) : null
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  // return await response?.json();
  // https://stackoverflow.com/a/51320025
  const raw = await response.text();
  return raw ? JSON.parse(raw) : {};

}

const get = <TEntity>(url: string): Promise<TEntity> =>
  send({ url: url, method: "GET" });

const post = <TEntity, TId>(url: string, data: TEntity): Promise<TId> =>
  send({ url: url, method: "POST", data: data });

const put = <TEntity>(url: string, data: TEntity): Promise<void> =>
  send({ url: url, method: "PUT", data: data });

const patch = <TEntity>(url: string, data: Partial<TEntity>): Promise<void> =>
  send({ url: url, method: "PATCH", data: data });

const remove = (url: string): Promise<void> =>
  send({ url: url, method: "DELETE" });

const client = {
  get: get,
  post: post,
  put: put,
  patch: patch,
  delete: remove
}

export {
  client,
  httpClient,
  SendParameters
}
