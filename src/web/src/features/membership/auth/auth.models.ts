import { User } from '../users/user.models';

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
  username: '',
  password: '',
  remember: false
})

export {
  LoginResponse,
  LoginCredential,
  intitCredential
}
