import { User } from '../users/user.models';
import { appConfig } from 'app-config';

type LoginCredential = {
  username: string,
  password: string,
  remember: boolean
}

type LoginResponse = {
  user: User,
  token: string
}

const intitCredential = () : LoginCredential => ({
  username: appConfig.env === 'dev' ? 'super_user@rapide' : '',
  password: appConfig.env === 'dev' ? '0Al}._bYf3G-@XN' : '',
  remember: false
})

export {
  LoginResponse,
  LoginCredential,
  intitCredential
}
