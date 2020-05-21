import { client } from "kernel/api-builder/http-client-facade";
import { LoginCredential, LoginResponse } from "./auth.models";

const apiBuilder = (resource: string) => {

  const login = (credentials: LoginCredential) : Promise<LoginResponse> =>
    client.post(`${resource}/login`, credentials);

  const logout = () : Promise<void> =>
    client.post(`${resource}/logout`, {});

  return {
    login,
    logout
  }
}

const authApi = apiBuilder('auth');

export { authApi }
