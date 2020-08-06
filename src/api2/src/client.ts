import { HttpVerb } from "./utils";
import { Lookup } from "./features/common/contract.models";
import { ResourceBuilder } from "./utils/resource.builder";
import { app } from "./app";
import suppertest from "supertest";

// import { response } from "express";
// import { token } from "morgan";
// import { types } from "@typegoose/typegoose";

type IClient<TId extends Object, TModel extends Object> = {
  get: (id: TId) => Promise<TModel>,
  lookup: () => Promise<Lookup[]>,
  create: (data: TModel) => Promise<TId>,
  update: (id: TId, data: TModel) => Promise<boolean>,
  patch: (id: TId, data: Partial<TModel>) => Promise<boolean>,
  remove: (id: TId) => Promise<boolean>,
}

type InvokeRequestArgs = {
  req: suppertest.SuperTest<suppertest.Test>,
  type: HttpVerb,
  url: string,
  data?: string | object | undefined,
  token?: string
}

const invokeRequest = async <TResponse>({ req, type, url, data, token }: InvokeRequestArgs): Promise<TResponse> => {
  let request = req[type](url);
  if (data) {
    request = request.send(data);
  }
  if (token) {
    request = request.set('Authorization', `Bearer ${token}`);
  }
  const response = await request;
  const successStatus: Record<HttpVerb, number> = {
    'get': 200,
    'post': 201,
    'put': 204,
    'patch': 204,
    'delete': 204
  };
  if (response.status !== successStatus[type]) {
    throw new Error(response.text);
  }
  return response.body as TResponse;
}

const buildClientFn = (req: suppertest.SuperTest<suppertest.Test>) => {

  return <TId extends Object, TModel extends Object>(urlBuilder: () => ResourceBuilder) => {


    return (token?: string): IClient<TId, TModel> => ({

      get: async (id: TId): Promise<TModel> => {
        const url = urlBuilder().paramval(id.toString()).build();
        return await invokeRequest({ type: 'get', req, url, token });
      },

      lookup: async (): Promise<Lookup[]> => {
        const url = urlBuilder().resource('lookup').build();
        return await invokeRequest({ type: 'get', req, url, token });
      },

      create: async (data: TModel): Promise<TId> => {
        const url = urlBuilder().build();
        return await invokeRequest({ type: 'post', req, url, data, token });
      },

      update: async (id: TId, data: TModel): Promise<boolean> => {
        const url = urlBuilder().paramval(id.toString()).build();
        return await invokeRequest({ type: 'put', req, url, data, token });
      },

      patch: async (id: TId, data: Partial<TModel>): Promise<boolean> => {
        const url = urlBuilder().paramval(id.toString()).build();
        return await invokeRequest({ type: 'patch', req, url, data, token });
      },

      remove: async (id: TId): Promise<boolean> => {
        const url = urlBuilder().paramval(id.toString()).build();
        return await invokeRequest({ type: 'delete', req, url, token });
      },
    });
  };
};

// reference: https://dev.to/nedsoft/testing-nodejs-express-api-with-jest-and-supertest-1km6
const request = suppertest(app);

const buildClient = buildClientFn(request);

export {
  IClient,
  request,
  buildClient,
}