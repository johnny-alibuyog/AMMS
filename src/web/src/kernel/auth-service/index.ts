import { Aurelia, PLATFORM, Container } from 'aurelia-framework';
import { AuthState } from '../state/models';
import { state } from '../state';

const app: Aurelia = Container.instance.get(Aurelia);

const getState = (): Promise<AuthState> => {
  return state.auth.current();
}

const signin = () => {
  state.auth.set({ token: 'some_token', signedIn: true, remember: false });
  state.user.set({ id: 'some_id', name: 'some_name' });
  changeRoot('dashboard');
}

const signout = () => {
  state.auth.reset();
  state.user.reset();
  changeRoot('signin');
}

const changeRoot = (key: 'signin' | 'dashboard') => {
  const root = (key == 'dashboard')
    ? PLATFORM.moduleName('app')
    : PLATFORM.moduleName('membership/users/signin');
  app.setRoot(root);
}

const authService = {
  signin,
  signout,
  getState
}

export { authService }
