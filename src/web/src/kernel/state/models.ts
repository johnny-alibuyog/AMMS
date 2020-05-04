type AuthState = {
  token: string,
  signedIn: boolean,
  remember: boolean
}

type UserState = {
  id: string,
  name: string
}

type State = {
  auth: AuthState,
  user: UserState
}

const initialAuthState: AuthState = {
  token: null,
  signedIn: false,
  remember: false
}

const initialUserState: UserState = {
  id: null,
  name: null
}

const initialState: State = {
  auth: initialAuthState,
  user: initialUserState
}

export {
  State,
  AuthState,
  UserState,
  initialState,
  initialAuthState,
  initialUserState
}
