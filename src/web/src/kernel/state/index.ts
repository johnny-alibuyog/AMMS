import { userActions, authActions, listPageActions, formPageActions } from "./actions"

const state = {
  user: userActions,
  auth: authActions,
  listPage: listPageActions,
  formPage: formPageActions
}

export { state }
