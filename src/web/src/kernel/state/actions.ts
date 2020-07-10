import { buildActions } from "./builder";
import { initialAuthState, initialUserState, initialListPageState, initialFormPageState } from "./models";

const authActions = buildActions('auth', initialAuthState);
const userActions = buildActions('user', initialUserState);
const listPageActions = buildActions('listPage', initialListPageState);
const formPageActions = buildActions('formPage', initialFormPageState);

export {
  authActions,
  userActions,
  listPageActions,
  formPageActions
}
