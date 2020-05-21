import { Aurelia, PLATFORM, Container } from 'aurelia-framework';
import { AuthState } from '../../../kernel/state/models';
import { state } from '../../../kernel/state';
import { authApi } from './auth.api';
import { LoginCredential } from './auth.models';

const app: Aurelia = Container.instance.get(Aurelia);

const getState = (): Promise<AuthState> => {
  return state.auth.current();
}

const signin = async (credential: LoginCredential): Promise<void> => {
  const response = await authApi.login(credential);
  state.auth.set({ token: response.token, signedIn: true, remember: false });
  state.user.set({ id: 'some_id', name: 'some_name' });
  changeRoot('dashboard');
}

const signout = async () : Promise<void> => {
  await authApi.logout();
  state.auth.reset();
  state.user.reset();
  changeRoot('signin');
}

const changeRoot = (key: 'signin' | 'dashboard') => {
  const root = (key == 'dashboard')
    ? PLATFORM.moduleName('app')
    : PLATFORM.moduleName('features/membership/auth/signin');
  app.setRoot(root);
}

const auth = {
  signin,
  signout,
  getState
}

export { auth }
