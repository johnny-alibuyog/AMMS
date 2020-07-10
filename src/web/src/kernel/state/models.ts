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

type FormPageState = {
  isDiscardPromptVisible: boolean
}

type State = {
  auth: AuthState,
  user: UserState,
  listPage: ListPageState,
  formPage: FormPageState
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

const initialFormPageState: FormPageState = {
  isDiscardPromptVisible: false
}

const initialState: State = {
  auth: initialAuthState,
  user: initialUserState,
  listPage: initialListPageState,
  formPage: initialFormPageState
}

export {
  State,
  AuthState,
  UserState,
  ListPageState,
  FormPageState,
  initialState,
  initialAuthState,
  initialUserState,
  initialListPageState,
  initialFormPageState
}
