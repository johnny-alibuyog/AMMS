import { Aurelia, Container, PLATFORM } from 'aurelia-framework';

import { AuthState } from '../../../kernel/state/models';
import { LoginCredential } from './auth.models';
import { api } from 'features/api';
import { fullName } from 'features/common/person/person.model';
import { state } from '../../../kernel/state';

const app: Aurelia = Container.instance.get(Aurelia);

const getState = (): Promise<AuthState> => {
  return state.auth.current();
}

const signin = async (credential: LoginCredential): Promise<void> => {
  const { token, user } = await api.auth.login(credential);
  state.auth.set({ token: token, signedIn: true, remember: false });
  state.user.set({ id: user.id, name: fullName(user.person) });
  changeRoot('dashboard');
}

const signout = async (): Promise<void> => {
  await api.auth.logout();
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
