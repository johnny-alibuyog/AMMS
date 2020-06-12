import { userActions, authActions, listPageActions } from "./actions"

const state = {
  user: userActions,
  auth: authActions,
  listPage: listPageActions
}

export { state }
