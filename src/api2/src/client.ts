import suppertest from "supertest";
import { app } from "./app";
import { ResourceBuilder } from "./utils/resource.builder";

type IClient<TId extends Object, TModel extends Object> = {
  get: (id: TId) => Promise<TModel | string>,
  create: (data: TModel) => Promise<TId | string>,
  update: (id: TId, data: TModel) => Promise<boolean | string>,
  remove: (id: TId) => Promise<boolean | string>
}

const buildClientFn = (req: suppertest.SuperTest<suppertest.Test>) => {

  return <TId extends Object, TModel extends Object>(builder: () => ResourceBuilder) => {

    return (token?: string): IClient<TId, TModel> => ({

      get: async (id: TId): Promise<TModel | string> => {
        const url = builder().paramval(id.toString()).build();
        const response = (token)
          ? await req.get(url).set('Authorization', `Bearer ${token}`)
          : await req.get(url);
        return response.status === 200
          ? response.body as TModel
          : response.text;
      },

      create: async (data: TModel): Promise<TId | string> => {
        const url = builder().build();
        const response = (token)
          ? await req.post(url).send(data).set('Authorization', `Bearer ${token}`)
          : await req.post(url).send(data);
        return response.status === 201
          ? response.body as TId
          : response.text;
      },

      update: async (id: TId, data: TModel): Promise<boolean | string> => {
        const url = builder().paramval(id.toString()).build();
        const response = (token)
          ? await req.put(url).send(data).set('Authorization', `Bearer ${token}`)
          : await req.put(url).send(data);
        return response.status === 204
          ? response.body as boolean
          : response.text;
      },

      remove: async (id: TId): Promise<boolean | string> => {
        const url = builder().paramval(id.toString()).build();
        const response = (token)
          ? await req.delete(url).set('Authorization', `Bearer ${token}`)
          : await req.delete(url);
        return response.status === 204
          ? response.body as boolean
          : response.text;
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