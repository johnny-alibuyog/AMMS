import { SigninCredential, SigninResponse } from "./auth.models";

import { client } from "kernel/api-builder/http-client-facade";

const apiBuilder = (resource: string) => {

  const signin = (credentials: SigninCredential) : Promise<SigninResponse> =>
    client.post(`${resource}/signin`, credentials);

  const signout = () : Promise<void> =>
    client.post(`${resource}/signout`, {});

  return {
    signin,
    signout
  }
}

const authApi = apiBuilder('auth');

export { authApi }
