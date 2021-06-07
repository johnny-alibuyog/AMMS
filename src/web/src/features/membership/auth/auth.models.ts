import { User } from '../users/user.models';
import { appConfig } from 'app-config';

type SigninCredential = {
  username: string,
  password: string,
  remember: boolean
}

type SigninResponse = {
  user: User,
  token: string
}

const intitCredential = () : SigninCredential => ({
  username: appConfig.env === 'dev' ? 'super_user@rapide' : '',
  password: appConfig.env === 'dev' ? '0Al}._bYf3G-@XN' : '',
  remember: false
})

export {
  SigninResponse,
  SigninCredential,
  intitCredential
}
