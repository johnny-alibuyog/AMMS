type AuthState = {
  token: string,
  signedIn: boolean,
  remember: boolean
}

type UserState = {
  id: string,
  name: string
}

type ListPageState = {
  isFilterVisible: boolean  
}

type State = {
  auth: AuthState,
  user: UserState,
  listPage: ListPageState
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

const initialListPageState: ListPageState = {
  isFilterVisible: false
}

const initialState: State = {
  auth: initialAuthState,
  user: initialUserState,
  listPage: initialListPageState
}

export {
  State,
  AuthState,
  UserState,
  ListPageState,
  initialState,
  initialAuthState,
  initialUserState,
  initialListPageState
}
